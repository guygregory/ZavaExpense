"""
GitHub Copilot SDK with Playwright and WorkIQ MCP Integration

This script demonstrates how to use the GitHub Copilot SDK to automate a manual task in a line of business application.
report tasks on a mock website. It integrates:
- Playwright MCP: For browser automation and web interaction
- WorkIQ MCP: For intelligent data processing and analysis
- Agent Skills: Custom skills for expense report operations

The script creates a Copilot session that can navigate a mock expenses website,
extract receipt information, and add expenses to an expense report through natural
language commands.
"""

import asyncio
from copilot import CopilotClient

async def main():
    # Create and start client
    client = CopilotClient()
    await client.start()

    # Create a session with MCP servers
    session = await client.create_session({
        "model": "claude-sonnet-4.5",
        "skills_path": [".github/skills"],
        "mcp_servers": {
            "workiq": {
                "command": "npx",
                "args": ["-y", "@microsoft/workiq", "mcp"],
                "tools": ["*"],
            },
            "playwright": {
                "type": "local",
                "command": "npx",
                "args": ["@playwright/mcp@latest"],
                "tools": ["*"],
            },
        },
    })

    # Wait for response using session.idle event
    done = asyncio.Event()

    def on_event(event):
        if event.type.value == "assistant.message":
            print(event.data.content)
        elif event.type.value == "session.idle":
            done.set()

    session.on(on_event)

    # Send a message and wait for completion
    await session.send({"prompt": "Add the receipt(s) to my expense report."})
    await done.wait()

    # Clean up
    await session.destroy()
    await client.stop()

asyncio.run(main())
