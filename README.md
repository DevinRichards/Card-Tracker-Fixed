# Card-Tracker-Fixed
# Card Tracker-Fixed

Card Tracker is a web application that allows users to track the value of their card collections. This app pulls data from the Scryfall API to get the latest prices for cards and displays the data to the user.

## Features

- Track the value of your card collection
- Search for cards and view current prices
- View price changes over time (hourly, daily, monthly, yearly)
- Smooth transitions between pages for a better user experience

## Technologies Used

- **Backend:** Flask (Python)
- **Frontend:** React, Tailwind CSS
- **Database:** SQLite/PostgreSQL (Choose based on your setup)

## Demo the Project Locally

### Prerequisites

Before setting up the project locally, ensure that you have the following installed:

- Python (>= 3.8)
- Node.js (>= 14.x)
- npm or yarn (npm preferred)
- PostgreSQL (optional, for production-like environment)
- Git

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/DevinRichards/Card-Tracker-Fixed.git
   cd Card-Tracker-Fixed

2. **Setup the backend**

    **Create a Virtual Environment**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  

    **Install Dependencies**
    ```bash
    pip install -r requirements.txt

    Create a .env file 

    