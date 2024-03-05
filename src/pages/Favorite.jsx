import { Box, ListItemButton, Typography } from "@mui/material";
import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import memoApi from "../api/memoApi"
import { setFavoriteList } from "../redux/features/favoriteSlice";

const Favorite = () => {
 const [activeItem, setActiveIndex] = useState(0);
  const dispatch = useDispatch();
  const memos = useSelector((state) => state.favorites.value);
  const { memoId } = useParams();

  useEffect(() => {
    const getMemos = async () => {
      try {
        const res = await memoApi.getFavorites();
        console.log(res);
        dispatch(setFavoriteList(res));

      } catch (err) {
        console.log(err);
      }
    };
    getMemos();
  }, []);

  useEffect(() => {
    const index = memos.findIndex((e) => e._id === memoId);
    setActiveIndex(index);
  }, [memoId]);

  return (
    <>
      <ListItemButton>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" fontWeight="700">
            お気に入り
          </Typography>
        </Box>
      </ListItemButton>
      {memos.map((item) => (
        <ListItemButton
          component={Link}
          to={`/memo/${item._id}`}
          sx={{
            pl: "20px",
          }}
        >
          <Typography
            variant="body2"
            fontWeight="700"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.title}
          </Typography>
        </ListItemButton>

      ))}
    </>
  );
};

export default Favorite;
