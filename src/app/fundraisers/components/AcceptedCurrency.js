
import  {useEffect, useState,useMemo} from "react";
import {FormControl,InputLabel,Select,MenuItem, Radio,ListItemText, FormHelperText} from "@mui/material";
import { Controller } from "react-hook-form";



//const currencyOptions = ["AUD", "CNY", "MMK", "SGD", "USD"];
 const AcceptedCurrency = ({control,errors}) => {
    const [selectedCurrency, setSelectedCurrency] = useState([]);
    const [currencyOptions, setCurrencyOptions] = useState([]);

     const handleCurrencyChange = (event) => {
       setSelectedCurrency(event.target.value);
     };

     //Fetching Currency Options
     const fetchCurrencyOptions = async (setCurrencyOptions)=>{
         const response = await fetch("/api/v1/currencies");
         const result= await response.json();
         if (result && Array.isArray(result.data)) {
          const currencyList = result.data.map((currency) => currency.CurrencyCode);
            setCurrencyOptions(currencyList);
         }
     };

     useEffect(()=>{
         fetchCurrencyOptions(setCurrencyOptions);

     },[]);

    const memorizedCurrencyOptions = useMemo(() => currencyOptions, [currencyOptions]);
    return (
      <FormControl fullWidth error={!!errors.AcceptedCurrencies} >
        <InputLabel id="Accepted Currency">Accepted Currency *</InputLabel>
        <Controller
          name="AcceptedCurrencies"
          control={control}
          defaultValue={[]}
          sx={{ marginTop: 2 }}
          render={({ field }) => (
            <Select
             labelId="Accepted Currency"
              multiple
              {...field}
              value={field.value || []}
              onChange={(event) => {
                field.onChange(event);
                handleCurrencyChange(event);
              }}
              renderValue={(selected) => selected.join(", ")}
            >
              {memorizedCurrencyOptions.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  <Radio checked={selectedCurrency.includes(currency)} />
                  <ListItemText primary={currency} />
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.AcceptedCurrencies && (
          <FormHelperText >{errors.AcceptedCurrencies.message}</FormHelperText>
        )}
      </FormControl>
    );
};
export default AcceptedCurrency;