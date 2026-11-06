import React, { useState, useEffect } from "react";

export default function Main() {
  const [showTable, setShowTable] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // States pour les filtres
  const [filterId, setFilterId] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, normal, high
  const [filterDate, setFilterDate] = useState("");

  // State pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fonction pour récupérer les données depuis l'API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      // Remplacez l'URL par celle de votre backend si nécessaire
      const response = await fetch("http://localhost:3000/api/patients");
      const data = await response.json();
      // On gère les formats de réponse courants (soit un tableau direct, soit {data: []})
      setPatients(Array.isArray(data) ? data : data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setLoading(false);
    }
  };

  // Chargement initial lors du passage à la vue tableau
  useEffect(() => {
    if (showTable) fetchPatients();
  }, [showTable]);

  // Réinitialiser la pagination à la page 1 quand un filtre change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterId, filterStatus, filterDate]);

  // === LOGIQUE DE FILTRAGE ===
  const filteredPatients = patients.filter((p) => {
    // 1. Filtre par ID (partiel ou complet)
    const matchId = p._id
      ? p._id.toString().toLowerCase().includes(filterId.toLowerCase())
      : true;

    // 2. Filtre par Date (format YYYY-MM-DD)
    const patientDate = p.date
      ? new Date(p.date).toISOString().split("T")[0]
      : "";
    const matchDate = filterDate ? patientDate === filterDate : true;

    // 3. Filtre par Statut (Seuil : 140 mg/dL)
    let matchStatus = true;
    if (filterStatus === "high") matchStatus = p.glucose > 140;
    if (filterStatus === "normal") matchStatus = p.glucose <= 140;

    return matchId && matchDate && matchStatus;
  });

  // === CALCULS DE PAGINATION ===
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPatients = filteredPatients.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const resetFilters = () => {
    setFilterId("");
    setFilterStatus("all");
    setFilterDate("");
  };

  return (
    <div className="relative min-h-screen bg-[#fcf8f8] text-slate-800 font-sans flex items-center justify-center p-4 overflow-hidden">
      {/* Formes décoratives en arrière-plan (Blobs) */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative w-full max-w-6xl z-10">
        {/* ================= PAGE D'ACCUEIL ================= */}
        {!showTable ? (
          <div className="flex flex-col items-center text-center space-y-8 bg-white/60 backdrop-blur-2xl p-12 md:p-20 rounded-[3rem] shadow-2xl border border-white transition-all">
            <div className="bg-gradient-to-br from-blue-500 to-blue-400 p-6 rounded-3xl shadow-2xl shadow-blue-200">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h3.5l1-3 2 6 1.5-3H20"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 12v.01M4 16v.01M4 20v.01M4 8v.01M4 4v.01"
                />
              </svg>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900">
                Patient<span className="text-blue-600">Sync</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                Plateforme intelligente de suivi glycémique. Visualisez et
                filtrez les données critiques de vos patients en un clic.
              </p>
            </div>

            <button
              onClick={() => setShowTable(true)}
              className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-xl hover:shadow-blue-200 hover:-translate-y-1"
            >
              Consulter le registre
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        ) : (
          /* ================= PAGE TABLEAU + FILTRES ================= */
          <div className="bg-white/80 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Registre Médical
                </h2>
                <p className="text-slate-400 font-medium">
                  Analyse des flux de données patients
                </p>
              </div>
              <button
                onClick={() => setShowTable(false)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Quitter
              </button>
            </div>

            {/* BARRE DE FILTRES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm">
              <div className="flex flex-col p-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">
                  Identifiant
                </label>
                <input
                  type="text"
                  value={filterId}
                  onChange={(e) => setFilterId(e.target.value)}
                  placeholder="Chercher ID..."
                  className="px-4 py-3 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition text-sm font-medium"
                />
              </div>

              <div className="flex flex-col p-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">
                  État de santé
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition text-sm font-bold"
                >
                  <option value="all">Tous les patients</option>
                  <option value="normal">Glycémie Normale</option>
                  <option value="high">Glycémie Élevée</option>
                </select>
              </div>

              <div className="flex flex-col p-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">
                  Date d'examen
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-4 py-3 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition text-sm font-medium"
                />
              </div>

              <div className="flex items-center justify-center p-2 pt-6">
                <button
                  onClick={resetFilters}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200"
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            {/* TABLEAU */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              {loading ? (
                <div className="py-24 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="font-bold text-slate-400 animate-pulse uppercase text-xs tracking-[0.2em]">
                    Synchronisation sécurisée...
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          ID Dossier
                        </th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Niveau Glucose
                        </th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Dose Insuline
                        </th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Horodatage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {currentPatients.length > 0 ? (
                        currentPatients.map((p, i) => (
                          <tr
                            key={p._id || i}
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            <td className="px-8 py-6">
                              <span className="font-mono text-[11px] bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                #
                                {p._id
                                  ? p._id.toString().slice(-8).toUpperCase()
                                  : "N/A"}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full ${p.glucose > 140 ? "bg-rose-500 animate-ping" : "bg-teal-400"}`}
                                ></div>
                                <span
                                  className={`text-xl font-black ${p.glucose > 140 ? "text-rose-600" : "text-slate-800"}`}
                                >
                                  {p.glucose}
                                </span>
                                <span className="text-[10px] font-bold text-slate-300 uppercase">
                                  mg/dL
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 font-bold text-sm border border-teal-100">
                                {p.insulin} U
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="text-sm font-bold text-slate-700">
                                {p.date
                                  ? new Date(p.date).toLocaleDateString(
                                      "fr-FR",
                                      { day: "2-digit", month: "long" },
                                    )
                                  : "—"}
                              </div>
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                {p.heure || "00:00"}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-24 text-center">
                            <div className="text-4xl mb-4 opacity-20">📂</div>
                            <p className="text-slate-400 font-bold italic">
                              Aucune donnée correspondante trouvée.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PAGINATION */}
              {!loading && filteredPatients.length > 0 && (
                <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Page {currentPage} sur {totalPages || 1} —{" "}
                    {filteredPatients.length} résultats
                  </span>
                  <div className="flex gap-3">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className="p-3 rounded-xl bg-white border border-slate-200 disabled:opacity-20 hover:border-blue-400 hover:text-blue-600 transition shadow-sm"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="p-3 rounded-xl bg-white border border-slate-200 disabled:opacity-20 hover:border-blue-400 hover:text-blue-600 transition shadow-sm"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
