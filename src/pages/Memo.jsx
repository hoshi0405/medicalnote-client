import { Box, IconButton, TextField } from '@mui/material'
import StarIcon from "@mui/icons-material/Star";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { useParams, useNavigate } from 'react-router-dom';
import memoApi from '../api/memoApi';
import { useDispatch, useSelector } from 'react-redux';
import { setMemo } from "../redux/features/memoSlice";
import { setFavoriteList } from "../redux/features/favoriteSlice";

function Memo() {
  const dispatch = useDispatch();
  const { memoId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
      color: theme.palette.action.disabled,
    },
  }));

  const memos = useSelector((state) => state.memo.value);
  const favoriteMemos = useSelector((state) => state.favorites.value);


  const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: 'Very Satisfied',
  },
};

  useEffect(() => {
    const getMemo = async () => {
      try {
        const res = await memoApi.getOne(memoId);
        setTitle(res.title);
        setRating(res.rating);
        setDescription(res.description);
        setIsFavorite(res.favorite);
      } catch (err) {
        alert(err)
      }
    };
    getMemo();
  }, [memoId]);

  let timer;
  const timeout = 500;

  const updateTitle = async (e) => {
    clearTimeout(timer);
    const newTitle = new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    setTitle(newTitle);
    let temp = [...memos];
    const index = temp.findIndex((e) => e.id === memoId);
    temp[index] = { ...temp[index], title: newTitle };

    //お気に入り機能追加後に設定する
    if (isFavorite) {
      let tempFavorite = [...favoriteMemos];
      const favoriteIndex = tempFavorite.findIndex((e) => e.id === memoId);
      tempFavorite[favoriteIndex] = {
        ...tempFavorite[favoriteIndex],
        title: newTitle,
      };
      dispatch(setFavoriteList(tempFavorite));
    }

    dispatch(setMemo(temp));

    timer = setTimeout(async () => {
    try {
      await memoApi.update(memoId, {title: newTitle})
    } catch(err) {
      alert(err);
    }
    }, timeout)
  }

  const updateDescription = async (e) => {
    clearTimeout(timer);
    const newDescription = e.target.value;
    setDescription(newDescription);

    timer = setTimeout(async () => {
    try {
      await memoApi.update(memoId, {description: newDescription})
    } catch(err) {
      alert(err);
    }
    }, timeout)
  }

  const updateRating = async (e) => {
    clearTimeout(timer);
    const newRating = e.target.value;
    setRating(newRating);

    timer = setTimeout(async () => {
    try {
      await memoApi.update(memoId, {rating: newRating})
    } catch(err) {
      alert(err);
    }
    }, timeout)
  }

  const IconContainer = (props) => {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }

  IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
  };

  const addFavorite = async () => {
    try {
      const memo = await memoApi.update(memoId, { favorite: !isFavorite });

      let newFavoriteMemos = [...favoriteMemos];
      if (isFavorite) {
        newFavoriteMemos = newFavoriteMemos.filter((e) => e.id !== memoId);
      } else {
        //これが消えない。お気に入りに移動してほしい。
        newFavoriteMemos.unshift(memo);
      }
      dispatch(setFavoriteList(newFavoriteMemos));
      setIsFavorite(!isFavorite);
    } catch (err) {
      alert(err);
    }
  };


  return (
    <>
      <Box sx={{
        display: "flex",
        alignItems: "center",
        width: "100∞",
      }}>

        <IconButton onClick={addFavorite} variant="outlined">
          {isFavorite ? (
            <StarIcon color="warning" />
          ) : (
            <StarBorderOutlinedIcon />
          )}
        </IconButton>
      </Box>
       <Box sx={{
        display: "flex",
        alignItems: "center",
        width: "100∞",
      }}
      >
         <p>体調を記録する</p>
          <StyledRating
            name="highlight-selected-only"
            defaultValue={rating}
            IconContainerComponent={IconContainer}
            getLabelText={(value) => customIcons[value].label}
            highlightSelectedOnly
            onChange={ updateRating }
        />

        </Box>
      <Box sx={{
        paddingX: "10px 50px"
      }}>
        <Box>


          <TextField
            onChange={updateTitle}
            value={title}
            variant="outlined" fullWidth sx={{
            ".MuiOutlinedInput-input": { padding: 0 },
            ".MuiOutlinedInput-notchedOutline": { border: "none" },
            }} />

          <TextField
            onChange={updateDescription}
            value={description}
            placeholder="追加"
            variant="outlined" fullWidth
            sx={{
            ".MuiOutlinedInput-input": { padding: 0 },
            ".MuiOutlinedInput-notchedOutline": { border: "none" },
              }} />
          </Box>
      </Box>

    </>
  )
}

export default Memo
