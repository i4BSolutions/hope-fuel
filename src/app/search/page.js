"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "../UI/Components/SearchBar";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";
import ItemList from "../UI/Components/ItemList";
import getScreenShotUrl from "../utilites/getScreenShotUrl";
import WalletSelect from "../UI/Components/GroupWallet";

import { useRouter } from "next/router";

export default function SearchBarForm() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  //Select Wallet

  const handleSelectedWallet = (wallet) => {
    console.log("Selcted wallet:", wallet);

    const currentUrl = new URL(window.location.href);
    console.log(currentUrl);

    currentUrl.searchParams.set("walletId", wallet);
    window.history.replaceState(null, "", currentUrl);

    setPage(1);
    handleSearch(searchQuery, wallet);
  };

  const handleSearch = async (HopeFuelID, wallet) => {
    if (!wallet && !HopeFuelID) {
      console.log("Wallet or HopeFuelID required for search");
      setError("Please select a wallet or provide a HopeFuelID");
      setNoResults(true);
      return; // Skip search if neither wallet nor HopeFuelID is provided
    }

    console.log("HopeID is " + HopeFuelID, "with Wallet: " + wallet);
    setLoading(true);
    setError(null);
    setNoResults(false);

    try {
      // Construct API URL based on provided parameters
      const queryParams = new URLSearchParams();
      if (HopeFuelID) queryParams.append("HopeFuelID", HopeFuelID);
      if (wallet) queryParams.append("wallet", wallet);
      queryParams.append("page", page);

      const url = `/api/searchDB?${queryParams.toString()}`;

      const response = await fetch(url);
      console.log(response);

      if (!response.ok) {
        throw new Error("No item found");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          if (Array.isArray(data[i]["ScreenShotLinks"])) {
            for (
              let screenshot = 0;
              screenshot < data[i]["ScreenShotLinks"].length;
              screenshot++
            ) {
              let tmp = await getScreenShotUrl(
                data[i]["ScreenShotLinks"][screenshot]
              );
              data[i]["ScreenShotLinks"][screenshot] = tmp.href;
            }
          }
        }
        if (data.length === 0 && page === 1) {
          setNoResults(true);
        } else {
          setItems((prevItems) =>
            page === 1 ? data : [...prevItems, ...data]
          );
        }
      }
    } catch (error) {
      console.error("Search Error:", error);
      setError("No item found");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on new search
    handleSearch(query);
  };

  // Load more items when "Load More" is clicked
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Fetch data when page changes
  useEffect(() => {
    if (page > 1 || searchQuery === "") {
      handleSearch(searchQuery);
    }
  }, [page]);

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: { xs: "8%", md: "5%" },
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      {/* Search Bar */}
      <Box sx={{ width: "100%", marginTop: "3px" }}>
        <SearchBar onSearch={handleSearchChange} />
      </Box>

      <Box sx={{ width: "100%", marginY: 2 }}>
        <Divider sx={{ borderColor: "#e0e0e0", width: "100%" }} />
      </Box>

      {/* wallet select */}
      <Box
        component="section"
        sx={{
          width: 270,
          paddingLeft: 2,
          paddingRight: 2,

          border: "1px solid #e0e0e0",
          borderRadius: "30px",
          marginBottom: "16px",
        }}
      >
        <WalletSelect
          onWalletSelected={(wallet) => handleSelectedWallet(wallet)}
        />{" "}
        {/* select wallet from DB*/}
      `</Box>`

      {/* Conditional Rendering */}
      {loading ? (
        <CircularProgress />
      ) : error || noResults ? (
        <Typography variant="body1" color="error">
          No item found
        </Typography>
      ) : (
        <ItemList
          items={items}
          hasInput={searchQuery.length > 0}
          onLoadMore={handleLoadMore}
          onItemClick={(HopeFuelID) => console.log("Item clicked:", HopeFuelID)}
        />
      )}
    </Container>
  );
}