import React, { useEffect, useState } from "react";
import { getWatchlist, removeStockFromWatchlist } from "../utils/watchlistManager";
import { auth } from "../components/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      getWatchlist().then((data) => {
        setWatchlist(data);
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

  const handleRemove = async (symbol) => {
    const confirm = window.confirm(`Remove ${symbol} from your watchlist?`);
    if (!confirm) return;

    await removeStockFromWatchlist(symbol);
    setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Loading your watchlist...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📈 My Watchlist</h2>
      {watchlist.length === 0 ? (
        <p style={styles.empty}>No stocks added yet.</p>
      ) : (
        <div style={styles.grid}>
          {watchlist.map((stock) => (
            <div key={stock.symbol} style={styles.card}>
              <h4>{stock.symbol}</h4>
              <p>{stock.name}</p>
              <button
                style={styles.removeBtn}
                onClick={() => handleRemove(stock.symbol)}
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const styles = {
  container: {
    padding: "2rem",
    maxWidth: "900px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#222",
  },
  empty: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#777",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "1.2rem",
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #dee2e6",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  removeBtn: {
    marginTop: "10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};


export default Watchlist;
