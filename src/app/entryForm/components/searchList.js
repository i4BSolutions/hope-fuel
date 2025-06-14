"use client";

import getSignedUrl from "@/app/utilites/getSignedUrl";
import { Box, CircularProgress, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import WalletSelect from "../../UI/Components/GroupWallet";
import SearchBar from "../../UI/Components/SearchBar";
import ItemList from "./ItemList";
import { useAgentStore } from "../../../stores/agentStore";

export default function SearchBarForm({ onItemClick }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [wallet, setWallet] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { agent } = useAgentStore();

  const fetchItems = async (
    query,
    selectedWallet,
    currentPage,
    isLoadMore = false
  ) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...(query && { HopeFuelID: query }),
        ...(selectedWallet && { wallet: selectedWallet }),
        page: currentPage,
        agentId: agent.id,
      });

      const response = await fetch(`/api/searchDB?${queryParams}`);
      if (!response.ok) throw new Error("No item found");

      const data = await response.json();

      if (Array.isArray(data.items)) {
        if (data.items.length > 0) {
          const updatedData = await Promise.all(
            data.items.map(async (item) => {
              if (Array.isArray(item.ScreenShotLinks)) {
                const updatedLinks = await Promise.all(
                  item.ScreenShotLinks.map(
                    async (link) => await getSignedUrl(link)
                  )
                );
                return { ...item, ScreenShotLinks: updatedLinks };
              }
              return item;
            })
          );
          setItems((prev) => {
            if (currentPage === 1) {
              return updatedData;
            } else {
              return [...prev, ...updatedData];
            }
          });
          setNoResults(false);

          setTotalPages(data.totalPages);
          setHasMore(currentPage < data.totalPages);
        } else if (currentPage === 1) {
          setItems([]);
          setNoResults(true);
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Search Error:", err);
      setError("No item found");
      setItems([]);
      setNoResults(true);
      setHasMore(false);
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
    fetchItems(searchQuery, wallet, nextPage, true);
  };

  useEffect(() => {
    if (wallet !== "") {
      fetchItems(searchQuery, wallet, 1);
    }
  }, [wallet]);

  return (
    <Box
      maxWidth="md"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: { xs: "8%", md: "5%" },
        pr: 2.5,
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
          width: "100%",
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
      ) : (
        <ItemList
          items={items}
          hasInput={!!searchQuery}
          onLoadMore={handleLoadMore}
          onItemClick={(HopeFuelID) => onItemClick(HopeFuelID)}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
        />
      )}
    </Box>
  );
}
