
"""
regression

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression,Ridge,Lasso
from sklearn.model_selection import train_test_split
from sklearn.model_selection import mean_squared_error
from sklearn.model_selection import r2_score

data=pd.read_csv("spotify_data_clean.csv")
x=data[['track_number']]
y=data['track_popularity']

#linear regression
x_train_s,x_test_s,y_train_s,y_test_s=train_test_split(x,y,test_size=0.3,random_state=42)
linear_model=LinearRegression()
linear_model.fit(x_train_s,y_train_s)
y_pre=linear_model.predict(x_test_s)

print("MSE",mean_squared_error(y_test_s,y_pre))
print("R2",r2_score(y_test_s,y_pre))

#multiple linear regression

x1=data[['track_number','popular','votes']]


#linear regression
x_train_m,x_test_m,y_train_m,y_test_m=train_test_split(x1,y,test_size=0.3,random_state=42)
linear_model=LinearRegression()
linear_model.fit(x_train_s,y_train_s)
y_pre_m=linear_model.predict(x_test_s)

print("MSE",mean_squared_error(y_test_s,y_pre))
print("R2",r2_score(y_test_s,y_pre_m))

#ridge regression
rid_mod=Ridge()
rid_mod.fit(x_train_m,y_train_m)
rid_pre=linear_model.predict(x_test_m)
print("MSE",mean_squared_error(y_test_m,rid_pre))
print("R2",r2_score(y_test_m,rid_pre))

#lasso regression
las_mod=Lasso()
las_mod.fit(x_train_m,y_train_m)
las_pre=linear_model.predict(x_test_m)
print("MSE",mean_squared_error(y_test_m,las_pre))
print("R2",r2_score(y_test_m,las_pre))"""

"""
import numpy as np
import pandas as pd

data = pd.DataFrame({
    'color':['red','red','blue','red'],
    'size':['small','large','small','small'],
    'shape':['round','round','square','square'],
    'class':['Yes','Yes','No','Yes']
})

X=data.iloc[:,:-1].values
y=data.iloc[:,-1].values

num=X.shape[1]

s=['%']*num
G=[['?']*num]

def speci(h,x):
    for i in range(num):
        if h[i]!='?' and h[i]!=x[i]:
            return False
    return True

def gen(g,s):
    for i in range(num):
        if g[i]!='?' and g[i]!=s[i]:
            return False
    return True


for i in range(len(X)):
    if y[i]=='Yes':
        for j in range(num):
            if s[j]=='%':
                s[j]=X[i][j]
            elif s[j]!=X[i][j]:
                s[j]='?'
        G=[g for g in G if speci(g,X[i])]

    else:
        
        new=[]
        for g in G:
           if speci(g,X[i]):
               for j in range(num):
                   if g[j]=='?' and s[j]!='?' and s[j]!=X[i][j]:
                       h=g.copy()
                       h[j]=s[j]
                       new.append(h)
        G=new
    G=[g for g in G if speci(g,s)]

print("final spe",s)
for g in G:
    print("final gen",g)
"""
import pandas as pd
import numpy as np

def candidate_elimination(df):

    data = df.values
    n_attr = len(df.columns) - 1

    S = list(data[0][:-1])
    G = [['?' for _ in range(n_attr)]]

    for row in data:
        X = row[:-1]
        y = row[-1]

        if y == 'Yes':
            for i in range(n_attr):
                if S[i] != X[i]:
                    S[i] = '?'
        else:
            for i in range(n_attr):
                if S[i] != X[i]:
                    temp = ['?' for _ in range(n_attr)]
                    temp[i] = S[i]
                    G.append(temp)

    return S, G


# Dataset
data = [
    ['Sunny','Warm','Normal','Strong','Warm','Same','Yes'],
    ['Sunny','Warm','High','Strong','Warm','Same','Yes'],
    ['Rainy','Cold','High','Strong','Warm','Change','No'],
    ['Sunny','Warm','High','Strong','Cool','Change','Yes']
]

columns = ['Sky','AirTemp','Humidity','Wind','Water','Forecast','EnjoySport']
df = pd.DataFrame(data, columns=columns)

# EDA
print("Attributes:", len(columns)-1)
print("Positive:", len(df[df['EnjoySport']=='Yes']))
print("Negative:", len(df[df['EnjoySport']=='No']))

S, G = candidate_elimination(df)

print("Final S:", S)
print("Final G:", G)
