document.addEventListener("DOMContentLoaded", function () {
  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
  ], function (Map, MapView, FeatureLayer, Graphic, GraphicsLayer) {
    const map = new Map({
      basemap: "streets-navigation-vector",
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-74.4057, 40.0583], // Longitude, latitude of New Jersey
      zoom: 8,
    });

    const opportunityZonesLayer = new FeatureLayer({
      url: "https://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services/Opportunity_Zones/FeatureServer",
      outFields: ["*"],
      popupTemplate: {
        title: "Opportunity Zone",
        content: "Census Tract: {tract}",
      },
    });

    const propertiesLayer = new GraphicsLayer();

    fetch("properties.json")
      .then((response) => response.json())
      .then((propertiesData) => {
        propertiesData.forEach(function (property) {
          const point = {
            type: "point",
            longitude: property.LONGITUDE,
            latitude: property.LATITUDE,
          };

          const markerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40],
            outline: {
              color: [255, 255, 255],
              width: 1,
            },
          };

          const pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
            attributes: property,
            popupTemplate: {
              title: "{TITLE}",
              content: "{FULL_ADDRESS}",
            },
          });

          propertiesLayer.add(pointGraphic);
        });

        map.add(opportunityZonesLayer);
        map.add(propertiesLayer);
      })
      .catch((error) => {
        console.error("Error loading properties data:", error);
      });
  });
});
