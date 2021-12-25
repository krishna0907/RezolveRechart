import "./App.css";
import { collection, getDocs } from "firebase/firestore";
import {
  LineChart,
  Line,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Tooltip,
  PieChart,
  Pie,
} from "recharts";

import { db } from "./firebase";
import { useEffect, useState } from "react";
function App() {
  
  // const [rechartData, setRechartData] = useState([{ name: "Page A", uv: 400, pv: 2400, amt: 2400 },{ name: "Page B", uv: 500, pv: 400, amt: 200 }]);
  const [rechartData, setRechartData] = useState([]);
  const [pieChartDataState, setPieChartDataState] = useState([]);
  const dupRemover = (users, compareKey) => {
    return users.reduce((acc, curr) => {
      if (!acc.includes(curr[compareKey])) {
        acc.push(curr[compareKey]);
      }
      return acc;
    }, []);
  };
  const pieChartData = (data) =>{
    debugger
    return data.reduce((acc,curr)=>{
      if(!acc.includes(curr.type)){
        acc.push(curr.type)
      }
      return acc
    },[]).map(type=>{
      let toLodObj = data.filter((userdata=>{
        return userdata.type == type
      }));
      return {type : type , totalByType : toLodObj.length}
    })
  }
  const calculateTheFinalResult = (users) => {
    // debugger;
    let collectionByType = [];
    let collectionTotalByMonth = [];
    let collectionByTypeFilter = [];
    let totalInEachType = {};
    dupRemover(users, "type").map((type) => {
      collectionByType = [];
      collectionByType = users.filter((user) => {
        return user.type == type;
      });
      
      dupRemover(collectionByType, "monthadded").map((month) => {
        collectionByTypeFilter = [];
        collectionByTypeFilter = collectionByType.filter((element) => {
          return month == element.monthadded;
        });
        collectionTotalByMonth.push({
          type: type,
          totalUsersForTheMonth: collectionByTypeFilter.length,
          monthadded: month,
        });
      });
    });

    let mergerByType = dupRemover(collectionTotalByMonth, "type").reduce(
      (acc, curr) => {
        let objToAdd = {};
        let count =0;
        collectionTotalByMonth.filter(element =>{return curr == element.type}).map((obj) => {
          if (obj.type == curr) {
            objToAdd["type"] = "Type" +curr;
            objToAdd["numberTypeToSort"] = Number(curr);
            objToAdd['monthadded'+ count] = obj.monthadded;
            objToAdd['total' + count] = obj.totalUsersForTheMonth;
          }
          count++
        });
        acc.push( objToAdd );
        return acc;
      },
      []
    );
    return mergerByType;
  };
  useEffect(() => {
    const getdata = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      
      setRechartData(calculateTheFinalResult(users).sort((a,b)=>{
        if(a.numberTypeToSort > b.numberTypeToSort){
          return 1
        }
        if(b.numberTypeToSort > a.numberTypeToSort){
          return -1
        }
      }));
      setPieChartDataState(pieChartData(users));
    };
    getdata();
  }, []);
  
  // const data = [
  //   {name: 'Type', students: 400},
  //   {name: 'Technical scripter', students: 700},
  //   {name: 'Geek-i-knack', students: 200},
  //   {name: 'Geek-o-mania', students: 1000}
  // ];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  debugger
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        { `Type ${index+1}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <div className='App'>
      <BarChart width={824} height={450} data={rechartData}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='type' />
        <YAxis domain={[0, 10]} tickCount={11}/>
        <Tooltip />
        <Legend />
        <Bar name ="Jan" dataKey='total0' fill='#8884d8' />
        <Bar name ="Feb" dataKey='total1' fill='#82ca9d' />
      </BarChart>

      <PieChart width={700} height={700}>
          <Pie label={renderCustomizedLabel} cx="50%" cy="50%" outerRadius={50} nameKey="type" data={pieChartDataState} dataKey="totalByType" outerRadius={250} fill="green" />
        </PieChart>
    </div>
  );
}

export default App;
