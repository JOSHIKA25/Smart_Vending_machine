"""import pandas as pd
df=pd.Series([18,45,12],index=['a','b','c'])
#print(df)
data=pd.DataFrame({
    'stu_name':['misi','keerthi','tamil','thanam'],
    'mark':[20,60,70,56],
    'age':[19,16,51,41]

})"""
#print(data)
"""data.head()
data.tail()
data.info()
data.describe()
data.sample(2)
data.shape
data.size
data.dtypes
data.index
data.columns
ind=data['mark']>60
print(ind)"""
""""
print(data.loc[0:])
print(data.iloc[0])
"""
#print(data[data['age']>40])
#print(data[data['age'].between(15,50)])
"""
data.rename(columns={'age':'new_age'})
data.insert(2,'city',['tri','coim','che','mala'])
#print(data)
#print(data.sort_values('age'))
#print(data['mark'].sum())
data.max()
#print(data.stack())
print(data['age']+1)
print(data['age'].apply(lambda x:x+1))
"""

#import numpy as np
#a=np.array([[1,2,4,1],[4,6,2,5]])
#b=np.array([2,6,4,7])
"""print(df)
print(np.full((2,4),7))
print(np.arange(1,10,2))
print(np.linspace(1,10,2))
print(np.eye(3))
print(np.identity(2))
print(np.diag([1,5,7]))"""
"""
print(np.dot(a,b))
print(np.matmul(a,b))
print(np.linalg.inv(a))
print(np.linalg.det(a))
print(np.linalg.norm(a))
"""
#print(np.random.randint(2,8,5))

import numpy as np
import pandas as pd
data=pd.DataFrame({
    'color':['red','red','blue','red'],
    'size':['small','large','small','small'],
    'shape':['round','round','square','square'],
    'class':['yes','yes','no','yes']
})
print(data.isnull().sum())
print(data.nunique())
print(data.shape)
print(data.dtypes)
print("nega",(data['class']=='no').sum())
print("posi", (data['class']=='yes').sum())
x=data.iloc[:,:-1].values
y=data.iloc[:,-1].values
num=x.shape[1]
s=['%']*num
G=[['?']*num]
print("initial S:", s)
print("initail G:",G)
def spe(h,x):
    for i in range(num):
        if h[i]!='?' and h[i]!=x[i]:
            return False
    return True

def gen(g,s):
    for i in range(num):
        if g[i]!='?' and g[i]!=s[i]:
            return False
    return True

for i in range(len(x)):
    if y[i]=='yes':
        for j in range(num):
            if s[j]=='%':
                s[j]=x[i][j]
            elif s[j]!=x[i][j]:
                s[j]='?'
        #print("s after first positive example: ",s)
        #break
        G=[g for g in G if spe(g,x[i])]
    else:
        new=[]
        for g in G:
            if spe(g,x[i]):
                for j in range(num):
                    if g[j]=='?' and s[j]!='?' and s[j]!=x[i][j]:
                        h=g.copy()
                        h[j]=s[j]
                        new.append(h)
        G=new
    G=[g for g in G if spe(g,s)]
    print("updated S",s)
    for g in G:
        print("updated G",g)
    
print("fianl S",s)
for g in G:
    print("final G",g)