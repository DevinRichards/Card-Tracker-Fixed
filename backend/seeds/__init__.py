from flask.cli import AppGroup
from seeds.users import seed_users, undo_users
from seeds.cards import seed_cards, undo_cards
from models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, run the undo command
        # This will truncate all tables prefixed with the schema name
        undo_cards()
        undo_users()
    
    # Seed data
    seed_users()
    seed_cards()

    # Add other seed functions here if needed


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_cards()
    undo_users()
    
    # Add other undo functions here if needed


# Make sure to register the seed commands with the Flask app
def register_seed_commands(app):
    app.cli.add_command(seed_commands)
