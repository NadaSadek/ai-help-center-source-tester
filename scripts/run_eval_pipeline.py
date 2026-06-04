import subprocess

SCRIPTS = [
    "scripts/run_bm25_retrieval.py",
    "scripts/run_keyword_retrieval.py",
    "scripts/run_embedding_retrieval.py",
    "scripts/run_hybrid_retrieval.py",
    "scripts/evaluate_retrieval.py",
]


def main() -> None:
    for script in SCRIPTS:
        print(f"Running {script}...")
        subprocess.run(["uv", "run", "python", script], check=True)

    print("all scripts were successfully executed")


if __name__ == "__main__":
    main()
