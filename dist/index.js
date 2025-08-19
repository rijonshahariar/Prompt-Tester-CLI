#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = require("fs");
const ai_1 = require("ai");
const openai_1 = require("@ai-sdk/openai");
const path_1 = require("path");
const program = new commander_1.Command();
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
            const mockFile = (0, path_1.resolve)(process.cwd(), options.mock);
            const mockData = JSON.parse((0, fs_1.readFileSync)(mockFile, 'utf-8'));
            const mock = mockData.find((m) => m.prompt === options.prompt);
            if (mock) {
                console.log('Mock Response:', mock.response);
            }
            else {
                console.log('No mock response found for prompt. Saving prompt to mock file.');
                mockData.push({ prompt: options.prompt, response: 'Mock response placeholder' });
                (0, fs_1.writeFileSync)(mockFile, JSON.stringify(mockData, null, 2));
            }
        }
        catch (err) {
            console.error('Error reading mock file:', err.message);
            process.exit(1);
        }
    }
    else if (options.live) {
        if (!process.env.OPENAI_API_KEY) {
            console.error('Error: OPENAI_API_KEY environment variable is required for live testing');
            process.exit(1);
        }
        try {
            const result = await (0, ai_1.generateText)({
                model: (0, openai_1.openai)('gpt-3.5-turbo'),
                prompt: options.prompt,
            });
            console.log('Live Response:', result.text);
        }
        catch (err) {
            console.error('Error with live API call:', err.message);
            process.exit(1);
        }
    }
    else {
        console.error('Error: Specify either --mock or --live');
        process.exit(1);
    }
});
program
    .command('init')
    .description('Initialize a mock response JSON file')
    .option('-f, --file <file>', 'Mock file name', 'mocks.json')
    .action((options) => {
    const mockFile = (0, path_1.resolve)(process.cwd(), options.file);
    const initialData = [];
    try {
        (0, fs_1.writeFileSync)(mockFile, JSON.stringify(initialData, null, 2));
        console.log(`Mock file created at ${mockFile}`);
    }
    catch (err) {
        console.error('Error creating mock file:', err.message);
        process.exit(1);
    }
});
program.parse(process.argv);
