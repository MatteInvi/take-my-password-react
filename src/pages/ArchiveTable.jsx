import React, { useEffect, useState, useCallback } from "react";
import ArchiveForm from "./ArchiveForm";
import "../ArchiveTable.css"; // Assicurati che il percorso sia corretto
import axios from "axios";


export default function ArchiveTable() {
  // Stati per i dati e il filtraggio
  const [archive, setArchive] = useState([]); // Dati della pagina corrente
  const [searchTerm, setSearchTerm] = useState("");

  // Stati per la paginazione
  const [currentPage, setCurrentPage] = useState(0); // Inizia dalla pagina 0
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10; // Corrisponde al PageableDefault nel tuo backend

  // Stati per UI e CRUD
  const [loading, setLoading] = useState(true);
  const [editingDato, setEditingDato] = useState(null);
  const [selectedDato, setSelectedDato] = useState(null);
  const [deleteDato, setDeleteDato] = useState(null);
  const [fetchError, setFetchError] = useState(null);



//Carico pagine filtrate da server
  const fetchArchive = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    const token = localStorage.getItem("token");

    try {
      let url = `http://localhost:8080/api/archive?page=${currentPage}&size=${itemsPerPage}`;

      // Aggiungi il termine di ricerca all'URL se presente
      if (searchTerm && searchTerm.trim() !== "") {
        url += `&searchTerm=${encodeURIComponent(searchTerm.trim())}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const pageData = response.data; // Oggetto Page di Spring Boot

      setArchive(pageData.content);
      setTotalPages(pageData.totalPages);
    } catch (err) {
      console.error("Errore fetch dati:", err);
      // Gestione errore autenticazione/rete
      setFetchError(
        "Impossibile caricare i dati. Errore: " +
          (err.response?.statusText || err.message)
      );
      setArchive([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm]);


  // Esegui il fetch all'avvio e ad ogni cambio di dipendenza
  useEffect(() => {
    fetchArchive();
  }, [fetchArchive]);


  // Funzione per gestire l'input di ricerca
  const handleSearch = (e) => {
    e.preventDefault();
    const term = e.target.elements.searchTerm.value;
    setSearchTerm(term);

    if (currentPage !== 0) {
      setCurrentPage(0);
    }
  };

  // Funzioni di navigazione paginazione
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  //Eliminazione
  const confirmDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/api/archive/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ricarica la pagina corrente dopo l'eliminazione
      fetchArchive();
      setDeleteDato(null); // Chiude la modale
    } catch (err) {
      alert(
        "Errore durante l'eliminazione: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  //Caricamento
  if (loading) return <p style={{ textAlign: "center" }}>Caricamento...</p>;
  if (fetchError)
    return (
      <p style={{ textAlign: "center", color: "red" }}>Errore: {fetchError}</p>
    );

  // Se non ci sono dati, mostra un messaggio a seconda se stiamo cercando o meno
  if (archive.length === 0) {
    if (searchTerm) {
      return (
        <p style={{ textAlign: "center" }}>
          Nessun risultato trovato per "{searchTerm}" nell'archivio.
        </p>
      );
    } else {
      return (
        <div className="container">
          <h1 className="title">Archivio</h1>
          <div id="top-bar-container">
            <button
              className="button button-add"
              onClick={() => setEditingDato({})}
            >
              Aggiungi Dato
            </button>
          </div>
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Nessun dato di accesso salvato. Aggiungine uno!
          </p>
        </div>
      );
    }
  }

  //Componente principale
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
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Cerca piattaforma"
              name="searchTerm"
              id="search"
            />
            <button type="submit">Cerca</button>
          </form>
        </div>
      </div>

      {/* Modale Aggiungi/Modifica */}
      {editingDato && (
        <ArchiveForm
          dato={editingDato.id ? editingDato : null}
          onSuccess={() => {
            setEditingDato(null);
            // Ricarica la pagina corrente dopo un successo
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
          {/* La tabella mappa direttamente 'archive' che è già filtrato e paginato */}
          {archive.map((item) => (
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

      {/* Controlli di Paginazione */}
      {totalPages > 1 && (
        <div
          id="pagination-controls"
          style={{ marginTop: "20px", textAlign: "center" }}
        >
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="button"
          >
            &laquo; Precedente
          </button>

          <span style={{ margin: "0 15px" }}>
            Pagina {currentPage + 1} di {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="button"
          >
            Successiva &raquo;
          </button>
        </div>
      )}

      {/* Modale Dettagli */}
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

      {/* Modale Eliminazione */}
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
