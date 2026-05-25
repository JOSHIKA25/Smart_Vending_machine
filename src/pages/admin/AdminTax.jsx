const [tax, setTax] = useState("");

useEffect(() => {
  axios.get("http://localhost:5000/api/tax")
    .then(res => setTax(res.data.tax_percent));
}, []);

const updateTax = async () => {
  await axios.put("http://localhost:5000/api/tax", {
    tax_percent: tax
  });

  alert("Tax Updated");
};
