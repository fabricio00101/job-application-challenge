import { useState } from "react";

function JobItem({ job, candidate, baseUrl }) {
    const [repoUrl, setRepoUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        if (!repoUrl) {
            setErrorMessage('Por favor, ingresá la URL del repositorio.');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            // Step 5: Enviar postulación
            const response = await fetch(`${baseUrl}/api/candidate/apply-to-job`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uuid: candidate.uuid,
                    jobId: job.id,
                    applicationId: candidate.applicationId,
                    candidateId: candidate.candidateId,
                    repoUrl: repoUrl
                })
            });

            if (response.ok) {
                setStatus('success');
            } else {
                const errData = await response.json();
                setStatus('error');
                setErrorMessage(errData.message || 'Error al enviar la postulación. Revisá los datos.');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Error de red. Intenta nuevamente.');
        }
    };

    return (
        <div className="job-card">
            <h3>{job.title}</h3>

            {status === 'success' ? (
                <div className="success-message">¡Postulación enviada con éxito! 🎉</div>
            ) : (
                <form onSubmit={handleSubmit} className="apply-form">
                    <input
                        type="url"
                        placeholder="https://github.com/tu-usuario/tu-repo"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        disabled={status === 'loading'}
                        required
                    />
                    <button type="submit" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Enviando...' : 'Submit'}
                    </button>
                    {status === 'error' && <p className="error-text">{errorMessage}</p>}
                </form>
            )}
        </div>
    );
}

export default JobItem;