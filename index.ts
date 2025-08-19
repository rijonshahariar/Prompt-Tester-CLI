#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { resolve } from 'path';

const program = new Command();

interface MockResponse {
  prompt: string;
  response: string;
}

program
  .version('1.0.0')
  .description('CLI tool to test AI prompts locally with mock responses or live API calls');

program
  .command('test')
  .description('Test a prompt with mock or live response')
  .option('-p, --prompt <prompt>', 'Prompt to test')
  .option('-m, --mock <file>', 'Path to mock JSON file')
  .option('-l, --live', 'Use live AI API (requires API key)')
  .action(async (options) => {
    if (!options.prompt) {
      console.error('Error: Please provide a prompt using --prompt');
      process.exit(1);
    }

    if (options.mock) {
      try {
        const mockFile = resolve(process.cwd(), options.mock);
        const mockData: MockResponse[] = JSON.parse(readFileSync(mockFile, 'utf-8'));
        const mock = mockData.find((m) => m.prompt === options.prompt);
        if (mock) {
          console.log('Mock Response:', mock.response);
        } else {
          console.log('No mock response found for prompt. Saving prompt to mock file.');
          mockData.push({ prompt: options.prompt, response: 'Mock response placeholder' });
          writeFileSync(mockFile, JSON.stringify(mockData, null, 2));
        }
      } catch (err) {
        console.error('Error reading mock file:', (err as Error).message);
        process.exit(1);
      }
    } else if (options.live) {
      if (!process.env.OPENAI_API_KEY) {
        console.error('Error: OPENAI_API_KEY environment variable is required for live testing');
        process.exit(1);
      }
      try {
        const result = await generateText({
          model: openai('gpt-3.5-turbo'),
          prompt: options.prompt,
        });
        console.log('Live Response:', result.text);
      } catch (err) {
        console.error('Error with live API call:', (err as Error).message);
        process.exit(1);
      }
    } else {
      console.error('Error: Specify either --mock or --live');
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize a mock response JSON file')
  .option('-f, --file <file>', 'Mock file name', 'mocks.json')
  .action((options) => {
    const mockFile = resolve(process.cwd(), options.file);
    const initialData: MockResponse[] = [];
    try {
      writeFileSync(mockFile, JSON.stringify(initialData, null, 2));
      console.log(`Mock file created at ${mockFile}`);
    } catch (err) {
      console.error('Error creating mock file:', (err as Error).message);
      process.exit(1);
    }
  });

program.parse(process.argv);