"""import numpy as np
import pandas as pd
df=pd.DataFrame({
    'color':['red','red','blue','red'],
    'size':['small','large','small','small'],
    'shape':['round','round','square','square'],
    'class':['yes','yes','no','yes']
})
x=df.iloc[:,:-1].values
y=df.iloc[:,-1].values
num=x.shape[1]
s=['%']*num
G=[['?']*num]
print('initial s',s)
print('initial g',G)
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

    print("udated s",s)
    for g in G:
        print("updated g",g)

print("final s",s)
for i in G:
    print("final g",i)


"""

"""
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import BayesianRidge
from sklearn.preprocessing import PolynomialFeatures
from scipy.stats import norm

x=np.array([1,5,8,2,3,7,4,8,4,7])
y=np.array([56,78,90,12,34,54,63,72,81,93])

xn=np.linspace(x.min(),x.max(),200)
for d in [1,2,3,4,5]:
    coe=np.polyfit(x,y,d)
    poly=np.poly1d(coe)
    yn=poly(xn)

    plt.plot(xn,yn,label=f"degree {d}")
plt.scatter(x,y)
plt.xlabel("person")
plt.ylabel("marks")
plt.show()

X=x.reshape(-1,1)
po=PolynomialFeatures(degree=3)
xpo=po.fit_transform(X)

model=BayesianRidge()
model.fit(xpo,y)
xnew=np.linspace(x.min(),x.max(),200).reshape(-1,1)
xnp=po.transform(xnew)
yp=model.predict(xnp)

plt.scatter(x,y)
plt.plot(xnew,yp)
plt.xlabel("person")
plt.ylabel("marks")
plt.show()

high=y>30
mu=np.mean(y)
si=np.std(y)
pri=np.sum(high)/len(y)
lik=1-norm.cdf(30,mu,si)
pos=pri*lik  
print(pos)

def gau(x,mu,si):
    return (1/si*(np.sqrt(2*(np.pi)))*np.exp(-0.5*((x-mu)/si)**2))

ynew=np.linspace(y.min()-10,y.max()+10,200)
ga=gau(ynew,mu,si)
plt.hist(y,bins=6,alpha=0.6)
plt.plot(ynew,ga)
plt.xlabel("person")
plt.ylabel("marks")
plt.show()
"""

import numpy as np
from sklearn.linear_model import LinearRegression,Ridge,Lasso,ElasticNet
from sklearn.metrics import mean_squared_error,r2_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures

np.random.seed(0)
x1=np.random.rand(100)*10
x2=np.random.rand(100)*5
y=3*x1+2*x2+np.random.rand(100)*4
X=np.column_stack((x1,x2))
x_tr,x_te,y_tr,y_te=train_test_split(X,y,test_size=0.3,random_state=42)
lin=LinearRegression()
lin.fit(x_tr[:,0].reshape(-1,1),y_tr)
yp=lin.predict(x_te[:,0].reshape(-1,1))
print("mse",mean_squared_error(y_te,yp))
print("r2",r2_score(y_te,yp))

lin=LinearRegression()
lin.fit(x_tr,y_tr)
yp=lin.predict(x_te)
print("mse",mean_squared_error(y_te,yp))
print("r2",r2_score(y_te,yp))

ri=Ridge(alpha=1.0)
ri.fit(x_tr,y_tr)
yp=ri.predict(x_te)
print("mse",mean_squared_error(y_te,yp))
print("r2",r2_score(y_te,yp))

li=Lasso(alpha=0.1)
li.fit(x_tr,y_tr)
yp=li.predict(x_te)
print("mse",mean_squared_error(y_te,yp))
print("r2",r2_score(y_te,yp))

es=ElasticNet(alpha=0.1,l1_ratio=0.5)
es.fit(x_tr,y_tr)
yp=es.predict(x_te)
print("mse",mean_squared_error(y_te,yp))
print("r2",r2_score(y_te,yp))

poly=PolynomialFeatures(degree=3)
x_tr_p=poly.fit_transform(x_tr)
x_te_p=poly.transform(x_te)
line=LinearRegression()
line.fit(x_tr_p,y_tr)
yp=line.predict(x_te_p)
print("mse",mean_squared_error(y_te,yp))
print("r2",r2_score(y_te,yp))

