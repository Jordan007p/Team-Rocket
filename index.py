import sqlite3
from OSMPythonTools.overpass import Overpass


def filter(query):
    data = []
    for node in query.nodes():
        tuple = (node.id(), node.lat(), node.lon(), node.tag('highway'))
        data.append(tuple)
    #print(data)
    return data


def insert_into_database(db, data):
    for d in data:
        command = ("INSERT INTO patishta(id,lat,lon,type) VALUES("+str(d[0])+","+str(d[1])+","+str(d[2])+",\""+d[3]+"\");")
        db.execute(command)


if __name__ == "__main__":
    overpass = Overpass()
    result = overpass.query('area["name:en"="North Macedonia"];(node[highway](area););out;')
    print(len(result.nodes()))
    con = sqlite3.connect('baza.db')
    command = ("CREATE TABLE patishta(id varchar(30),lat varchar(30),lon varchar(30),type varchar(100));")
    con.execute(command)
    data = filter(result)
    insert_into_database(con, data)
    command = ("SELECT * FROM patishta;")
    print(con.execute(command).fetchall())
    con.commit()
    con.close()