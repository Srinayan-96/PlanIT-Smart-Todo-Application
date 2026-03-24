import { useEffect, useMemo, useState } from "react";

const DEFAULT_SECONDS = 25 * 60;

function FocusTimer() {
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const formatted = useMemo(() => {
    const mins = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const secs = (secondsLeft % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }, [secondsLeft]);

  return (
    <section className="card">
      <h3 className="panel-title">Focus Timer</h3>
      <p className="timer-value">{formatted}</p>
      <div className="timer-actions">
        <button className="primary-btn" type="button" onClick={() => setRunning((v) => !v)}>
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="action-btn"
          type="button"
          onClick={() => {
            setRunning(false);
            setSecondsLeft(DEFAULT_SECONDS);
          }}
        >
          Reset
        </button>
      </div>
    </section>
  );
}

export default FocusTimer;
