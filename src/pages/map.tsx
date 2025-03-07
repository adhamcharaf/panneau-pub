import dynamic from "next/dynamic";
import Head from "next/head";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false, // Désactive le rendu côté serveur pour Leaflet
});

export default function MapPage() {
  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Carte des Panneaux Publicitaires</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Carte des Panneaux Publicitaires</h1>
      <MapComponent />
    </div>
  );
}
