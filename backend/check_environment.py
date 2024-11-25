import os
import sys
import pandas as pd

def check_environment():
    print("Checking environment setup...")
    
    # Check current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Current directory: {current_dir}")
    
    # Check database file
    db_path = os.path.join(current_dir, "imdb_movies-1.csv")
    if os.path.exists(db_path):
        print("✓ Database file found")
        try:
            df = pd.read_csv(db_path)
            print(f"✓ Database loaded successfully with {len(df)} rows")
        except Exception as e:
            print(f"✗ Error loading database: {str(e)}")
    else:
        print("✗ Database file not found")
    
    # Check posters directory
    posters_dir = os.path.join(current_dir, "posters")
    if not os.path.exists(posters_dir):
        os.makedirs(posters_dir)
        print("Created posters directory")
    else:
        print("✓ Posters directory exists")
    
    # Check permissions
    try:
        test_file = os.path.join(posters_dir, "test.txt")
        with open(test_file, 'w') as f:
            f.write("test")
        os.remove(test_file)
        print("✓ Write permissions OK")
    except Exception as e:
        print(f"✗ Permission error: {str(e)}")

if __name__ == "__main__":
    check_environment() 