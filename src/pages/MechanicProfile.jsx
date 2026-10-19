import { useEffect, useState } from "react";
import api from "../api/client";

function MechanicProfile() {
  const [profile, setProfile] = useState({ fullName: "", phone: "", specialization: "", serviceLocation: "", experienceYears: "", mechanicLatitude: "", mechanicLongitude: "", active: false });
  const [savedProfile, setSavedProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    api.get("/api/mechanic/profile")
      .then(({ data }) => { if (active) { setProfile(data); setSavedProfile(data); } })
      .catch(() => { if (active) setError("Unable to load your profile."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const handleChange = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  const cancel = () => { setProfile(savedProfile); setEditing(false); setError(""); };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true); setError(""); setMessage("");
    try {
      const payload = { fullName: profile.fullName.trim(), phone: profile.phone.trim(), specialization: profile.specialization.trim(), serviceLocation: profile.serviceLocation.trim(), experienceYears: Number(profile.experienceYears) };
      const { data } = await api.put("/api/mechanic/profile", payload);
      setProfile(data); setSavedProfile(data); setEditing(false); setMessage("Profile updated and service address resolved successfully.");
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Unable to save your profile. Check the address and try again; it must be resolvable by the configured location service.");
    } finally { setSaving(false); }
  };
  return (
    <div className="p-4">
      <div className="mb-4"><h2 className="fw-bold mb-1">My Profile</h2><p className="text-muted mb-0">Manage your mechanic profile and service information.</p></div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}{message && <div className="alert alert-success" role="status">{message}</div>}
      <div className="card border-0 shadow-sm"><div className="card-body p-4"><div className="d-flex justify-content-between align-items-center mb-4"><div><h5 className="fw-bold mb-1">Mechanic Information</h5><p className="text-muted mb-0">Keep your service details up to date.</p></div>{!editing && <button className="btn btn-outline-primary" disabled={loading} onClick={() => setEditing(true)}>Edit Profile</button>}</div>
        {loading ? <p className="text-muted">Loading profile...</p> : <form onSubmit={handleSubmit}><div className="row g-4">
          {[{name:"fullName",label:"Full Name",type:"text"},{name:"phone",label:"Phone Number",type:"tel"},{name:"specialization",label:"Specialization (or General)",type:"text"},{name:"experienceYears",label:"Experience (Years)",type:"number"}].map((field)=><div className="col-md-6" key={field.name}><label className="form-label fw-semibold" htmlFor={field.name}>{field.label}</label><input id={field.name} name={field.name} type={field.type} className="form-control" value={profile[field.name] ?? ""} onChange={handleChange} disabled={!editing} required min={field.name==="experienceYears"?0:undefined} max={field.name==="experienceYears"?60:undefined} maxLength={field.name==="fullName"?100:field.name==="phone"?15:field.name==="specialization"?30:undefined} /></div>)}
          <div className="col-12"><label className="form-label fw-semibold" htmlFor="serviceLocation">Service Location</label><textarea id="serviceLocation" name="serviceLocation" className="form-control" rows="2" value={profile.serviceLocation} onChange={handleChange} disabled={!editing} required maxLength={255} /></div>
        </div><p className="small text-muted mt-3 mb-0">Enter your service address; RoadAssist resolves it for nearby matching. The address is sent to the configured geocoding service. A specific specialization matches the same problem category; General is the catch-all.</p><p className="small text-muted mt-2">Location status: {profile.mechanicLatitude != null && profile.mechanicLongitude != null ? "Resolved for nearby matching" : "Not resolved yet"}. OpenStreetMap-based results are © OpenStreetMap contributors.</p>{editing && <div className="mt-4"><button type="submit" className="btn btn-primary px-4 me-2" disabled={saving}>{saving?"Saving…":"Save Changes"}</button><button type="button" className="btn btn-secondary" onClick={cancel} disabled={saving}>Cancel</button></div>}</form>}
      </div></div>
      <div className="card border-0 shadow-sm mt-4"><div className="card-body p-4"><h5 className="fw-bold mb-3">Account Status</h5><span className={`badge ${profile.active?"bg-success":"bg-secondary"}`}>{profile.active?"Active":"Inactive"}</span><span className="text-muted ms-2">Availability is managed separately.</span></div></div>
    </div>
  );
}
export default MechanicProfile;
