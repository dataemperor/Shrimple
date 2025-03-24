import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

const Map: React.FC = () => {
    const shrimpFarmingData: [number, number, number][] = [
        [7.5833, 79.7956, 31], // Chilaw Lagoon
        [8.0322, 79.8356, 30], // Puttalam Lagoon
        [7.7167, 79.9333, 32], // Mundalama Lagoon
        [7.8333, 81.6000, 29], // Batticaloa Lagoon
        [8.0333, 81.1500, 28], // Kalpitiya Lagoon
    ];

    useEffect(() => {
        const map = L.map("heatmap", {
            center: [7.8731, 80.7718],
            zoom: 8,
            layers: [L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")],
        });

        const heatLayer = ((L as any).heatLayer(
            shrimpFarmingData.map(([lat, lon, temp]) => [lat, lon, temp / 40]),
            {
                radius: 50,
                blur: 25,
                maxZoom: 11,
                gradient: {
                    0.2: "blue",
                    0.4: "cyan",
                    0.6: "yellow",
                    0.8: "orange",
                    1.0: "red",
                },
            }
        ) as any).addTo(map);

        return () => {
            map.remove();
        };
    }, []);

    return (
        <div style={{ position: "relative" }}>
            <h1 style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
                Sri Lanka Shrimp Farming Lagoons Temperature Map
            </h1>
            <div id="heatmap" style={{ height: "600px", width: "100%" }}></div>

            {shrimpFarmingData.map(([lat, lon, temp], index) => (
                <MapContainer
                    key={index}
                    center={[lat, lon]}
                    zoom={8}
                    style={{ display: "none" }}
                >
                    <Marker position={[lat, lon]}>
                        <Popup>
                            <strong>Temperature:</strong> {temp}°C<br />
                            <strong>Location:</strong> {lat.toFixed(2)}, {lon.toFixed(2)}
                        </Popup>
                    </Marker>
                </MapContainer>
            ))}
        </div>
    );
};

export default Map;
