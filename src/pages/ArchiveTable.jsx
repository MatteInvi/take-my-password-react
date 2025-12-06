import React, { useEffect, useState } from "react";
import ArchiveForm from "./ArchiveForm";
import "../ArchiveTable.css";

export default function ArchiveTable() {
  const [archive, setArchive] = useState([]);
  const [filteredArchive, setFilteredArchive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDato, setEditingDato] = useState(null);
  const [selectedDato, setSelectedDato] = useState(null);
  const [deleteDato, setDeleteDato] = useState(null);

  // Chiamata al back-end per ricevere i dati da visulizzare con incluso il token salvato in locale
  const fetchArchive = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/archive", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nel caricamento dei dati");
        }
        return res.json();
      })
      .then((data) => {
        setArchive(data);
        setFilteredArchive(data);
      })
      .catch((err) => {
        console.error("Errore fetch:", err);
        setArchive([]);
        setFilteredArchive([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArchive();
  }, []);

  // Funzione di ricerca per piattaforma
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredArchive(
      archive.filter((item) =>
        item.platform.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  // Funzione di eliminazione della credenziale con ricarica archivio e chiusura modale in caso fosse aperta
  const confirmDelete = (id) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/archive/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante eliminazione");
        fetchArchive();
        setDeleteDato(null);
      })
      .catch((err) => alert(err.message));
  };

  // Schermata di caricamento/ dati non disponibili
  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>  
 

  // Pagina utente con la gestione dei dati
  return (
    <div className="container">
      <h1 className="title">Archivio</h1>

      <div id="top-bar-container">
        <div id="top-bar">
          <button
            className="button button-add"
            onClick={() => setEditingDato({})}
          >
            Aggiungi Dato
          </button>
          <input
            type="text"
            placeholder="Cerca piattaforma..."
            value={searchTerm}
            onChange={handleSearch}
            id="search"
          />
        </div>
      </div>

      {editingDato && (
        <ArchiveForm
          dato={editingDato.id ? editingDato : null}
          onSuccess={() => {
            setEditingDato(null);
            fetchArchive();
          }}
          onCancel={() => setEditingDato(null)}
        />
      )}

      <table id="table_index">
        <thead>
          <tr>
            <th>Piattaforma</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {filteredArchive.map((item) => (
            <tr
              key={item.id}
              onClick={() => setSelectedDato(item)}
              style={{ cursor: "pointer" }}
            >
              <td>{item.platform}</td>
              <td id="button-section">
                <button
                  className="button button-details"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingDato(item);
                  }}
                >
                  Modifica
                </button>
                <button
                  className="button button-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDato(item);
                  }}
                >
                  Elimina
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Dettagli */}
      {selectedDato && (
        <div className="modal-overlay" onClick={() => setSelectedDato(null)}>
          <div
            id="details-modal"
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Dettagli</h2>
            <p>
              <strong>Piattaforma:</strong> {selectedDato.platform}
            </p>
            <p>
              <strong>Username:</strong> {selectedDato.username}
            </p>
            <p>
              <strong>Password:</strong> {selectedDato.password}
            </p>
            <p>
              <strong>Annotazioni:</strong> {selectedDato.annotation}
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                className="button button-edit"
                onClick={() => {
                  setEditingDato(selectedDato);
                  setSelectedDato(null);
                }}
              >
                Modifica
              </button>
              <button
                className="button button-delete"
                onClick={() => setDeleteDato(selectedDato)}
              >
                Elimina
              </button>
              <button
                className="button button-details"
                onClick={() => setSelectedDato(null)}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminazione */}
      {deleteDato && (
        <div className="modal-overlay" onClick={() => setDeleteDato(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Conferma eliminazione</h3>
            <p>
              Sei sicuro di voler eliminare i dati di accesso della piattaforma{" "}
              <strong>{deleteDato.platform}</strong>?
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                className="button button-delete"
                onClick={() => confirmDelete(deleteDato.id)}
              >
                Elimina
              </button>
              <button
                className="button button-details"
                onClick={() => setDeleteDato(null)}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
