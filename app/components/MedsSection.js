"use client";

import { useFormState } from "react-dom";

const initialState = { error: null };

export default function MedsSection({ meds, createMedAction }) {
  const [state, formAction] = useFormState(createMedAction, initialState);

  return (
    <section className="card">
      <h2>Medications</h2>
      <p className="helper">Create a new medication. After submit, the list refreshes.</p>
      <form action={formAction} className="grid">
        <div className="grid two">
          <div>
            <label htmlFor="med-name">Name</label>
            <input id="med-name" name="name" required />
          </div>
          <div>
            <label htmlFor="med-dosage">Dosage</label>
            <input id="med-dosage" name="dosage" required />
          </div>
        </div>
        <div className="grid two">
          <div>
            <label htmlFor="med-frequency">Frequency</label>
            <input id="med-frequency" name="frequency" required />
          </div>
          <div>
            <label htmlFor="med-time">Time to take</label>
            <input id="med-time" name="timeToTake" placeholder="08:00 AM" required />
          </div>
        </div>
        <div className="grid two">
          <div>
            <label htmlFor="med-dosage-amount">Dosage amount</label>
            <input id="med-dosage-amount" name="dosageAmount" type="number" step="0.01" />
          </div>
          <div>
            <label htmlFor="med-dosage-unit">Dosage unit</label>
            <select id="med-dosage-unit" name="dosageUnit">
              <option value="">Select unit</option>
              <option value="mg">mg</option>
              <option value="ml">ml</option>
              <option value="pill">pill</option>
            </select>
          </div>
        </div>
        <div className="grid two">
          <div>
            <label htmlFor="med-quantity">Quantity</label>
            <input id="med-quantity" name="quantity" type="number" defaultValue={0} />
          </div>
          <div>
            <label htmlFor="med-notes">Notes</label>
            <input id="med-notes" name="notes" />
          </div>
        </div>
        <button type="submit" className="primary">Save medication</button>
        {state?.error ? <p className="error">{state.error}</p> : null}
      </form>

      <div className="meds-grid" style={{ marginTop: 16 }}>
        {meds.length === 0 ? (
          <p className="helper">No medications yet.</p>
        ) : (
          meds.map((med) => (
            <div key={med._id} className="med-card">
              <strong>{med.name}</strong>
              <div className="helper">{med.dosage} • {med.frequency} • {med.timeToTake}</div>
              {med.dosageAmount ? (
                <div className="helper">Amount: {med.dosageAmount} {med.dosageUnit || ""}</div>
              ) : null}
              {med.notes ? <div className="helper">Notes: {med.notes}</div> : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
