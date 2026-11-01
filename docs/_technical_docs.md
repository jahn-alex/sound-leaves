# Technical Docs

## Setup and Technologies

- React Frontend App hosted on Cloudflare Pages
- Supabase Postgres Database for Metadata
- Cloudflare R2 for pdfs and audio files

## Views

The whole app should be build to be viewed on desktop and on mobile. Mobile focuses on uploading files and scanning documents. Desktop focuses more on the management side to keep an overview over all the information.

### 1. File Upload View

- Upload `.pdf` or `.mp3` files / Scan documents via camera
- Enter metadata (mandatory = *)
    - Select Song *
    - Select Instrument *
    - ...
- functionality to autofill that data
    - image recognition?
    - api calls?

### 2. Data View

- View Sheets/Audio by:
    - Song
    - Instrument
- Add:
    - Songs
    - Instruments

### 3. Completion View (planned)

- Show dashboard to know which sheets are missing

### 4. Playing View (planned)

- View selected sheet and audio playback option
