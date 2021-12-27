import shapely
import folium
import openrouteservice as ors
import json

from shapely import geometry
from shapely.geometry import MultiPolygon, Polygon

#coordinates = [[21.43165, 41.99609], [22.50217, 41.14762]]  # OVDE STAVI POCETNI I KRAJNI KOORDINATI

def generate_map(coordinates):
    ors_key = '5b3ce3597851110001cf62488658392d825546aeaf8199344e027b60'

    client = ors.Client(key=ors_key)

    f = open('patarini.json')
    polygons = json.load(f)

    avoid_polygons = []

    for data in polygons['features']:
        cords = data['geometry']['coordinates']
        shell = [cords[0][0], cords[0][1], cords[0][2], cords[0][3]]
        poly = Polygon(shell)
        avoid_polygons.append(poly)

    multipolygon = MultiPolygon(avoid_polygons)

    avoid_options = {

        'avoid_polygons': geometry.mapping(multipolygon)
    }

    route = client.directions(coordinates=coordinates,
                            profile='driving-car',
                            format='geojson')

    route1 = client.directions(coordinates=coordinates,
                            profile='driving-car',
                            format='geojson', options=avoid_options)

    #print(route['features'][0]["properties"]["summary"])  # OVA E TOA STO TI TREBA DISTANCE E VO METRI I DURATION E VO SEKUNDI
    # map
    map_directions = folium.Map(location=[41.99609, 21.43165], zoom_start=8.5)

    # add geojson to map
    folium.GeoJson(route, name='route').add_to(map_directions)
    folium.GeoJson(route1, name='route1').add_to(map_directions)

    # add layer control to map (allows layer to be turned on or off)
    folium.LayerControl().add_to(map_directions)
    # display map
    map_directions

    map_directions.save('map.html')

#generate_map(coordinates)