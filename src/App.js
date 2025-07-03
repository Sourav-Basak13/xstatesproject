import { useEffect, useState } from "react";
import "./App.css";

const fetchAllCountries = async () => {
  const response = await fetch(
    "https://crio-location-selector.onrender.com/countries"
  );
  const data = await response.json();

  return data;
};
const fetchAllStates = async (countryName) => {
  const response = await fetch(
    `https://crio-location-selector.onrender.com/country=${countryName}/states`
  );
  const data = await response.json();

  return data;
};
const fetchAllCities = async (countryName, stateName) => {
  const response = await fetch(
    `https://crio-location-selector.onrender.com/country=${countryName}/state=${stateName}/cities`
  );
  const data = await response.json();

  return data;
};

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [placeDetails, setPlaceDetails] = useState({
    country: "",
    state: "",
    city: "",
  });
  useEffect(() => {
    fetchAllCountries()
      .then((data) => setCountries(data))
      .catch((error) => console.error(error.message));
  }, []);
  useEffect(() => {
    !!placeDetails?.country?.length &&
      fetchAllStates(placeDetails?.country)
        .then((data) => setStates(data))
        .catch((error) => console.error(error.message));
  }, [placeDetails?.country]);
  useEffect(() => {
    !!placeDetails?.state?.length &&
      !!placeDetails?.country?.length &&
      fetchAllCities(placeDetails?.country, placeDetails?.state)
        .then((data) => setCities(data))
        .catch((error) => console.error(error.message));
  }, [placeDetails?.country, placeDetails?.state]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Select Location</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <select
          className="select"
          value={placeDetails.country}
          onChange={(e) =>
            setPlaceDetails((prev) => ({
              ...prev,
              country: e.target.value,
              state: "",
              city: "",
            }))
          }
        >
          <option value="">Select Country</option>
          {countries?.map((country_name) => (
            <option key={country_name} value={country_name}>
              {country_name}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={placeDetails.state}
          onChange={(e) =>
            setPlaceDetails((prev) => ({
              ...prev,
              state: e.target.value,
              city: "",
            }))
          }
          disabled={!placeDetails.country.length}
        >
          <option value="">Select State</option>
          {states?.map((state_name) => (
            <option key={state_name} value={state_name}>
              {state_name}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={placeDetails.city}
          onChange={(e) =>
            setPlaceDetails((prev) => ({
              ...prev,
              city: e.target.value,
            }))
          }
          disabled={!placeDetails.state.length}
        >
          <option value="">Select City</option>
          {cities?.map((city_name) => (
            <option key={city_name} value={city_name}>
              {city_name}
            </option>
          ))}
        </select>
      </div>
      {!!placeDetails?.country?.length &&
        !!placeDetails?.state?.length &&
        !!placeDetails?.city?.length && (
          <p
            style={{
              color: "#aaa",
              fontWeight: "bold",
            }}
          >
            <span style={{ color: "#333" }}>
              You selected{" "}
              <span
                style={{
                  fontSize: "20px",
                }}
              >
                {placeDetails?.city}
              </span>
              ,&nbsp;
            </span>
            {placeDetails?.state}, {placeDetails?.country}
          </p>
        )}
    </div>
  );
}

export default App;
