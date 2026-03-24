import { useEffect, useState } from "react";

function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="card">
      <h3 className="panel-title">Live Clock</h3>
      <div className="digital-clock-shell">
        <p className="digital-clock">{now.toLocaleTimeString()}</p>
        <p className="digital-date">
          {now.toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </section>
  );
}

export default ClockWidget;
