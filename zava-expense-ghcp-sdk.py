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


max_verbosity = False  # Set to True to enable all event types, False for a more concise output


class Colors:
    CYAN = "\033[96m"
    MAGENTA = "\033[95m"
    YELLOW = "\033[93m"
    DARK_YELLOW = "\033[33m"
    GREEN = "\033[92m"
    RED = "\033[91m"
    RESET = "\033[0m"


def write_status(label, color, message):
    print(f"{color}[{label}]{Colors.RESET} {message}")


DEFAULT_EVENT_TYPES = {
    "assistant.message",
    "tool.execution_start",
    "session.idle",
}


MAX_EVENT_TYPES = {
    "assistant.turn_start",
    "assistant.intent",
    "assistant.turn_end",
    "tool.execution_start",
    "tool.execution_progress",
    "tool.execution_complete",
    "session.error",
    "assistant.message_delta",
    "assistant.reasoning_delta",
    "assistant.message",
    "assistant.reasoning",
    "session.idle",
}


async def main():
    # Create and start client
    client = CopilotClient()
    await client.start()

    # Create a session with MCP servers
    session = await client.create_session({
        "model": "claude-haiku-4.5",
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
                "args": ["@playwright/mcp@latest","--browser=msedge"], # Remove --browser=msedge to use default browser
                "tools": ["*"],
            },
        },
    })

    # Wait for response using session.idle event
    done = asyncio.Event()

    def on_event(event):
        event_type = event.type.value
        active_event_types = MAX_EVENT_TYPES if max_verbosity else DEFAULT_EVENT_TYPES

        if event_type not in active_event_types:
            return

        if event_type == "assistant.turn_start":
            write_status("Turn", Colors.CYAN, "Copilot is thinking...")

        elif event_type == "assistant.intent":
            write_status("Intent", Colors.MAGENTA, event.data.intent)

        elif event_type == "assistant.turn_end":
            write_status("Turn", Colors.CYAN, "Copilot finished this turn.")

        elif event_type == "tool.execution_start":
            write_status("Tool", Colors.YELLOW, f"Running: {event.data.tool_name}")

        elif event_type == "tool.execution_progress":
            write_status("Progress", Colors.DARK_YELLOW, event.data.progress_message)

        elif event_type == "tool.execution_complete":
            if hasattr(event.data, "error") and event.data.error:
                write_status("Tool Error", Colors.RED, event.data.error.message)
            else:
                result = (
                    event.data.result.content
                    if hasattr(event.data, "result") and event.data.result
                    else "Completed"
                )
                write_status("Tool", Colors.GREEN, result)

        elif event_type == "session.error":
            write_status("Error", Colors.RED, event.data.message)

        elif event_type == "assistant.message_delta":
            delta = event.data.delta_content or ""
            print(delta, end="", flush=True)

        elif event_type == "assistant.reasoning_delta":
            delta = event.data.delta_content or ""
            print(delta, end="", flush=True)

        elif event_type == "assistant.message":
            write_status("Assistant", Colors.GREEN, event.data.content)

        elif event_type == "assistant.reasoning":
            write_status("Reasoning", Colors.MAGENTA, event.data.content)

        elif event_type == "session.idle":
            write_status("Session", Colors.CYAN, "Completed.")
            done.set()

    session.on(on_event)

    # Send a message and wait for completion
    await session.send({"prompt": "Add the receipt(s) to my expense report."})
    await done.wait()

    # Clean up
    await session.destroy()
    await client.stop()

asyncio.run(main())
