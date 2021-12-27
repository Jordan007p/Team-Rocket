import sqlite3
from OSMPythonTools.overpass import Overpass


def filter(query):
    data = []
    for node in query.nodes():
        tuple = (node.tag("name:en"), node.lat(), node.lon())
        data.append(tuple)
    #print(data)
    return data


def insert_into_database(db, data):
    for d in data:
        command = ("INSERT INTO gradovi(ime,lat,lon) VALUES(\""+str(d[0])+"\","+str(d[1])+","+str(d[2])+");")
        #print(command)
        db.execute(command)


if __name__ == "__main__":
    overpass = Overpass()
    result = overpass.query('area["name:en"="North Macedonia"];(node[place="city"](area););out;')
    print(len(result.nodes()))
    con = sqlite3.connect('baza.db')
    command = ("CREATE TABLE gradovi(ime varchar(30),lat double,lon double);")
    con.execute(command)
    data = filter(result)
    insert_into_database(con, data)
    command = ("SELECT * FROM gradovi;")
    print(con.execute(command).fetchall())
    con.commit()
    con.close()
    result = overpass.query('area["name:en"="North Macedonia"];(node[place="town"](area););out;')
    print(len(result.nodes()))
    con = sqlite3.connect('baza.db')
    data = filter(result)
    insert_into_database(con, data)
    command = ("SELECT * FROM gradovi;")
    print(con.execute(command).fetchall())
    con.commit()
    con.close()