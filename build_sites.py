import os
def w(path,c):
    os.makedirs(os.path.dirname(path),exist_ok=True)
    with open(path,'w',encoding='utf-8') as f: f.write(c)
# will write actual content via bash heredoc
print("ready")