"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";
import SearchBar from "../UI/Components/SearchBar";
import ItemList from "../UI/Components/ItemList";
import WalletSelect from "../UI/Components/GroupWallet";
import getScreenShotUrl from "../utilites/getScreenShotUrl";

export default function SearchBarForm() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [wallet, setWallet] = useState("");
  const [page, setPage] = useState(1);

  const fetchItems = async (query, selectedWallet, currentPage) => {
    setLoading(true);
    setError(null);
    setNoResults(false);

    try {
      const queryParams = new URLSearchParams({
        ...(query && { HopeFuelID: query }),
        ...(selectedWallet && { wallet: selectedWallet }),
        page: currentPage,
      });

      const response = await fetch(`/api/searchDB?${queryParams}`);
      if (!response.ok) throw new Error("No item found");

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        for (const item of data) {
          if (Array.isArray(item.ScreenShotLinks)) {
            const updatedLinks = await Promise.all(
              item.ScreenShotLinks.map(
                async (link) => (await getScreenShotUrl(link)).href
              )
            );
            item.ScreenShotLinks = updatedLinks;
          }
        }
        setItems((prev) => (currentPage === 1 ? data : [...prev, ...data]));
      } else if (currentPage === 1) {
        setNoResults(true);
      }
    } catch (err) {
      console.error("Search Error:", err);
      setError("No item found");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1);
    fetchItems(query, wallet, 1);
  };

  const handleWalletSelect = (selectedWallet) => {
    setWallet(selectedWallet);
    const url = new URL(window.location.href);
    url.searchParams.set("walletId", selectedWallet);
    window.history.replaceState(null, "", url);

    setPage(1);
    fetchItems(searchQuery, selectedWallet, 1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(searchQuery, wallet, nextPage);
  };

  useEffect(() => {
    if (searchQuery === "" && page === 1) fetchItems("", wallet, 1);
  }, []);

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: { xs: "8%", md: "5%" },
        textAlign: "center",
      }}
    >
      <Box sx={{ width: "100%", mt: 1 }}>
        <SearchBar onSearch={handleSearchChange} />
      </Box>

      <Box sx={{ width: "100%", my: 2 }}>
        <Divider sx={{ borderColor: "#e0e0e0" }} />
      </Box>

      <Box
        component="section"
        sx={{
          width: 270,
          px: 2,
          border: "1px solid #e0e0e0",
          borderRadius: "30px",
          mb: 2,
        }}
      >
        <WalletSelect onWalletSelected={handleWalletSelect} />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error || noResults ? (
        <Typography variant="body1" color="error">
          No item found
        </Typography>
      ) : (
        <ItemList
          items={items}
          hasInput={!!searchQuery}
          onLoadMore={handleLoadMore}
          onItemClick={(HopeFuelID) => console.log("Item clicked:", HopeFuelID)}
        />
      )}
    </Container>
  );
}
