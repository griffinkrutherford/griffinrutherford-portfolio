# AOL Dial-up Sound Instructions

To add the iconic AOL dial-up sound to your 90s website:

## Quick Method - Download from YouTube
1. Go to a YouTube to MP3 converter like:
   - https://ytmp3.cc
   - https://y2mate.com
   - https://www.320ytmp3.com

2. Paste this YouTube URL: https://www.youtube.com/watch?v=D1UY7eDRXrs

3. Click Convert/Download and save as `aol-dialup.mp3`

4. Move the downloaded file to this `/audio/` directory in your portfolio

5. That's it! The sound will auto-play when people visit your 90s site

## Alternative: Terminal Method (if you have youtube-dl or yt-dlp)
```bash
# Install yt-dlp if you don't have it
brew install yt-dlp

# Download the audio
yt-dlp -x --audio-format mp3 -o "aol-dialup.mp3" https://www.youtube.com/watch?v=D1UY7eDRXrs

# Move to audio folder
mv aol-dialup.mp3 /Users/griffinrutherford/Documents/portfolio/audio/
```

## File Requirements
- Filename: `aol-dialup.mp3` or `aol-dialup.wav`
- Location: `/audio/` directory
- Recommended: Keep file size under 500KB
- Format: MP3 preferred for compatibility

## Features Implemented
- Auto-plays on first visit to 90s site (per session)
- Shows authentic AOL 3.0 connection dialog
- Displays modem connection messages
- Animates connection speed up to 56k
- "Skip" button for impatient visitors
- Volume set to 30% to not blast visitors

The dial-up experience only plays once per browser session, so it won't annoy returning visitors!