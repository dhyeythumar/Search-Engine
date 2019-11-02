import mysql.connector
import json


mydb = mysql.connector.connect(
    host="localhost",
    user="--db user name here--",
    passwd="--db password here--",
    database="--db name here--"
)

mycursor = mydb.cursor()


def save_index(keywords):

    last_index = []
    for keyword in keywords:
        try:
            sql_select = 'SELECT index_id FROM index_list WHERE page_index = %s'
            select_val = (keyword,)

            mycursor.execute(sql_select, select_val)
            myresult = mycursor.fetchone()
            if(myresult):
                last_index.append(myresult[0])
                # print('Keyword already existed')
            else:
                sql_insert = "INSERT INTO index_list (page_index) VALUES (%s)"
                insert_val = (keyword,)

                mycursor.execute(sql_insert, insert_val)
                mydb.commit()
                last_index.append(mycursor.lastrowid)
                # print('Keyword inserted')

        except Exception as e:
            print('ERR from index Iist table', e)

    return last_index


def index_br_web(last_page_insertId, last_index_insertId):

    for last_index in last_index_insertId:

        try:
            sql_select = 'SELECT index_id FROM index_br_web WHERE index_id = %s AND web_page_id = %s'
            select_val = (last_index, last_page_insertId,)

            mycursor.execute(sql_select, select_val)
            myresult = mycursor.fetchone()
            if(myresult):
                # print('Keyword-Bridge-Web already existed')
                pass
            else:
                sql_insert = "INSERT INTO index_br_web (index_id, web_page_id) VALUES (%s, %s)"
                insert_val = (last_index, last_page_insertId,)

                mycursor.execute(sql_insert, insert_val)
                mydb.commit()
                # print('Keyword-Bridge-Web inserted')

        except Exception as e:
            print('ERR from index-br-web table', e)


def save_image(images):

    last_index = []
    for image in images:
        try:
            sql_select = 'SELECT image_id FROM image_list WHERE image_keyword = %s'
            select_val = (image['image_keyword'],)

            mycursor.execute(sql_select, select_val)
            myresult = mycursor.fetchone()
            if(myresult):
                last_index.append(myresult[0])
                # print('Image already existed')
            else:
                sql_insert = "INSERT INTO image_list (image_url, image_keyword) VALUES (%s, %s)"
                insert_val = (image['image_link'], image['image_keyword'],)

                mycursor.execute(sql_insert, insert_val)
                mydb.commit()
                last_index.append(mycursor.lastrowid)
                # print('Image inserted')

        except Exception as e:
            print('ERR from image Iist table', e)

    return last_index


def image_br_web(last_page_insertId, last_image_insertId):

    for last_image in last_image_insertId:

        try:
            sql_select = 'SELECT image_id FROM image_br_web WHERE image_id = %s AND web_page_id = %s'
            select_val = (last_image, last_page_insertId,)

            mycursor.execute(sql_select, select_val)
            myresult = mycursor.fetchone()
            if(myresult):
                # print('Image-Bridge-Web already existed')
                pass
            else:
                sql_insert = "INSERT INTO image_br_web (image_id, web_page_id) VALUES (%s, %s)"
                insert_val = (last_image, last_page_insertId,)

                mycursor.execute(sql_insert, insert_val)
                mydb.commit()
                # print('Image-Bridge-Web inserted')

        except Exception as e:
            print('ERR from image-br-web table', e)


def save_pages():
    # save all the data in to the data base here.
    with open('data.json', 'r') as f:
        data = json.load(f)

    if(len(data) > 0):
        for page in data:

            try:
                sql_select = 'SELECT web_page_id, priority FROM web_pages WHERE link = %s'
                select_val = (page['link'],)

                mycursor.execute(sql_select, select_val)
                myresult = mycursor.fetchone()
                if(myresult):
                    sql_update = 'UPDATE web_pages SET priority = %s WHERE link = %s'
                    update_val = (myresult[1] + 1, page['link'],)

                    mycursor.execute(sql_update, update_val)
                    mydb.commit()
                    last_page_insertId = myresult[0]
                    print('Web page value updated')
                else:
                    sql_insert = "INSERT INTO web_pages (link, title, description) VALUES (%s, %s, %s)"
                    insert_val = (page['link'], page['title'], page['desc'],)

                    mycursor.execute(sql_insert, insert_val)
                    mydb.commit()
                    last_page_insertId = mycursor.lastrowid
                    print('Web page inserted')

                # ------------------------------Inserting the keywords--------------------------------
                last_index_insertId = save_index(page['keywords'])
                # -------------------------Insert into Index-bridge-Web table-------------------------
                index_br_web(last_page_insertId, last_index_insertId)

                # ---------------------------------Inserting the images--------------------------------
                last_image_insertId = save_image(page['images'])
                # --------------------------Insert into Image-bridge-Web table-----------------------
                image_br_web(last_page_insertId, last_image_insertId)

            except Exception as e:
                print('ERR from web pages table', e)
                pass

        with open('data.json', 'w') as f:
            json.dump([], f)


def select_data():

    index_list = []

    mycursor.execute('SELECT page_index FROM index_list LIMIT 1000 OFFSET 1000')
    raw_index_list = mycursor.fetchall()
    mycursor.execute('SELECT title FROM web_pages LIMIT 1000 OFFSET 1000')
    raw_title_list = mycursor.fetchall()
    mycursor.execute('SELECT image_keyword FROM image_list LIMIT 200 OFFSET 100')
    raw_image_list = mycursor.fetchall()

    for res in raw_index_list:
        index_list.append(res[0])
    for res in raw_title_list:
        index_list.append(res[0])
    for res in raw_image_list:
        index_list.append(res[0])

    with open('../data/index_list.json', 'w') as fi:
        json.dump(index_list, fi)

save_pages()
select_data()
