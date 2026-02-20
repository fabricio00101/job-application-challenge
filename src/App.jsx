import { useState, useEffect } from "react";
import JobItem from './JobItem';
import './App.css';

const BASE_URL = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net';
const MY_EMAIL = 'jfmilanesio@gmail.com';

function App() {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 2: Obtener tus datos de candidato
        const candidateRes = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${MY_EMAIL}`);
        if (!candidateRes.ok) throw new Error('Error al obtener datos del candidato');
        const candidateData = await candidateRes.json();
        setCandidate(candidateData);

        // Step 3: Obtener la lista de posiciones
        const jobsRes = await fetch(`${BASE_URL}/api/jobs/get-list`);
        if (!jobsRes.ok) throw new Error('Error al obtener la lista de trabajos');
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Apagamos el estado de carga
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Cargando la información...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app-container">
      <header>
        <h1>Portal de Postulaciones</h1>
        {candidate && <p>Bienvenido/a, {candidate.firstName} {candidate.lastName}</p>}
      </header>
      
      <main>
        <h2>Posiciones Abiertas</h2>
        <div className="jobs-list">
          {jobs.map(job => (
            <JobItem key={job.id} job={job} candidate={candidate} baseUrl={BASE_URL} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;