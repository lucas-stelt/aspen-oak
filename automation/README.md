# Automation — AspenOak Content Pipeline

This folder will hold scripts for the automated content update pipeline.

## Planned Architecture

```
Owner drops photo/text into iCloud shared folder
          ↓
Watcher script detects new file
          ↓
Agent processes content (resize image, generate HTML snippet)
          ↓
Agent commits change to GitHub
          ↓
Netlify auto-deploys — site is live within ~30 seconds
```

## Status
Not yet implemented. Will build after:
1. GitHub → Netlify auto-deploy is connected
2. iCloud shared folder is set up with client
3. Content update routine is established

## Notes
- Images should be resized/compressed before adding to `site/assets/` (target: <300kb per image)
- Consider a Claude-powered agent to handle HTML updates from natural language content descriptions
