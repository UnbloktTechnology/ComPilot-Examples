import { useState } from 'react';
import { API_CALLS, ApiCall } from '../data/api-calls';

function extractParams(endpoint: string): string[] {
  const matches = endpoint.match(/{(.*?)}/g);
  return matches ? matches.map(m => m.replace(/[{}]/g, '')) : [];
}

export default function Home() {
  const [selectedCall, setSelectedCall] = useState(API_CALLS[0]);
  const [body, setBody] = useState(
    selectedCall.hasBody ? JSON.stringify(selectedCall.bodyTemplate, null, 2) : ''
  );
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [paramValues, setParamValues] = useState<{ [key: string]: string }>({});

  // Met à jour le body quand on change de call
  const handleSelectCall = (call: ApiCall) => {
    setSelectedCall(call);
    setBody(call.hasBody ? JSON.stringify(call.bodyTemplate, null, 2) : '');
    setResponse('');
    // Reset param values for new call with defaults
    const params = extractParams(call.endpoint);
    const defaultValues: { [key: string]: string } = {};
    
    params.forEach(param => {
      if (param === 'datasetId') {
        defaultValues[param] = process.env.NEXT_PUBLIC_DEFAULT_DATASET_ID || '';
      } else if (param === 'datasetRowId') {
        defaultValues[param] = process.env.NEXT_PUBLIC_DEFAULT_DATASET_ROW_ID || '';
      } else {
        defaultValues[param] = '';
      }
    });
    
    setParamValues(defaultValues);
  };

  // Execute API call to compilot.ai
  const handleExecute = async () => {
    setLoading(true);
    setResponse('');
    
    try {
      const res = await fetch('/api/compilot-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          method: selectedCall.method,
          endpoint: selectedCall.endpoint,
          params: paramValues,
          body: selectedCall.hasBody && body ? JSON.parse(body) : undefined
        })
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(JSON.stringify({ success: false, error: String(err) }, null, 2));
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Colonne gauche : liste des calls */}
      <div style={{ width: 320, borderRight: '1px solid #eee', padding: 24, background: '#f8fafc' }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 24 }}>API Calls</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {API_CALLS.map((call) => (
            <li key={call.id} style={{ marginBottom: 12 }}>
              <button
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: call.id === selectedCall.id ? '#e0e7ef' : 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  padding: '10px 14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: '#222',
                  outline: 'none',
                }}
                onClick={() => handleSelectCall(call)}
              >
                <span style={{ fontWeight: 700, color: '#2563eb', marginRight: 8 }}>{call.method}</span>
                {call.name}
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{call.endpoint}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Colonne droite : détail du call, body, bouton, réponse */}
      <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'auto' }}>
        {/* Détail du call sélectionné */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            <span style={{ color: '#2563eb', marginRight: 10 }}>{selectedCall.method}</span>
            <span>{selectedCall.endpoint}</span>
          </div>
          <div style={{ color: '#64748b', fontSize: 15 }}>{selectedCall.description}</div>
        </div>

        {/* Inputs dynamiques pour les paramètres d'endpoint */}
        {extractParams(selectedCall.endpoint).map(param => (
          <div key={param} style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 500, marginRight: 8 }}>{param} :</label>
            <input
              type="text"
              value={paramValues[param] || ''}
              onChange={e => setParamValues(v => ({ ...v, [param]: e.target.value }))}
              style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 15 }}
              placeholder={param}
            />
          </div>
        ))}

        {/* Body JSON modifiable */}
        {selectedCall.hasBody && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>Body (JSON)</div>
            <textarea
              style={{ width: '100%', minHeight: 360, fontFamily: 'monospace', fontSize: 15, borderRadius: 6, border: '1px solid #d1d5db', padding: 12, background: '#f1f5f9' }}
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>
        )}

        {/* Bouton exécuter */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={handleExecute}
            disabled={loading}
            style={{
              background: '#2563eb',
              color: 'white',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              borderRadius: 6,
              padding: '12px 32px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Execution...' : 'Exécuter'}
          </button>
        </div>

        {/* Réponse JSON readonly */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>Réponse</div>
          <textarea
            style={{
              width: '100%',
              flex: 1,
              fontFamily: 'monospace',
              fontSize: 15,
              borderRadius: 6,
              border: '1px solid #d1d5db',
              padding: 12,
              background: '#f1f5f9',
              color: '#222',
              resize: 'none',
              minHeight: 0
            }}
            value={response}
            readOnly
          />
        </div>
      </div>
    </div>
  );
} 