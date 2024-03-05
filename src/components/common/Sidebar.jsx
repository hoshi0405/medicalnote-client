import React, { useEffect, useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { Box } from '@mui/system';
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import assets from "../../assets/index";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import memoApi from '../../api/memoApi';
import { setMemo }  from '../../redux/features/memoSlice';



function Sidebar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { memoId } = useParams();
  const user = useSelector((state) => state.user.value);
  const memos = useSelector((state) => state.memo.value);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const getMemos = async () => {
      try {
        const res = await memoApi.getAll();
        dispatch(setMemo(res));
      } catch (err) {
        console.log(err);
      }
    };
    getMemos();
  }, [dispatch]);

  useEffect(() => {
    const activeIndex = memos.findIndex((e) => e._id === memoId);
    setActiveIndex(activeIndex);
  }, [memos, memoId, navigate]);



  const addMemo = async () => {
    try {
    const lastCallTimestamp = localStorage.getItem('lastCallTimestamp');

    // タイムスタンプが保存されているか、一日以上経過しているかチェック
    if (!lastCallTimestamp || Date.now() - Number(lastCallTimestamp) >= 24 * 60 * 60 * 1000) {
      const res = await memoApi.create();
      const createMemos = [res, ...memos];
      dispatch(setMemo(createMemos));
      navigate(`memo/${res._id}`);

      // 現在のタイムスタンプを保存
      localStorage.setItem('lastCallTimestamp', Date.now().toString());
    } else {
      alert('一日に一度のみの記録です');
    }
  } catch (err) {
    alert(err);
  }
};

  return(
    <Drawer
      container={window.document.body}
      variant="permanent"
      open={true}
      sx={{
        width: 250,
        height: "100vh"
      }}>

      <List
        sx={{
          width: 250,
          height: "100vh",
          backgroundColor: assets.colors.secondary
        }}
        >
        <ListItemButton>
          <Box sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <Typography variant="body2" fontWeight="700">
              {user.username}
            </Typography>
            <IconButton onClick={logout}>
              <LogoutOutlinedIcon fontSize="small"/>
            </IconButton>
          </Box>
        </ListItemButton>
        <Box sx={{paddingTop: "10px"}}></Box>
        <ListItemButton component={Link} to={`/favorite`}>
          <Box sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <Typography variant="body2" fontWeight="700">
              お気に入り
            </Typography>
            <IconButton>
              <AddBoxOutlinedIcon fontSize="smail"/>
            </IconButton>
          </Box>
        </ListItemButton>
         <Box sx={{paddingTop: "10px"}}></Box>
        <ListItemButton>
          <Box sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <Typography variant="body2" fontWeight="700">
              記録の追加
            </Typography>
            <IconButton>
              <AddBoxOutlinedIcon fontSize="smail" onClick={addMemo}/>
            </IconButton>
          </Box>
        </ListItemButton>
        <ListItemButton component={Link} to={`/graph`}>
          <Box sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <Typography variant="body2" fontWeight="700">
              体調の記録
            </Typography>
          </Box>
        </ListItemButton>
        {memos.map((item, index) => (
          <ListItemButton
           key={item._id}
            selected={index === activeIndex}
            component={Link}
            to={`/memo/${item._id}`}
            sx={{ pl: "20px" }}
            >
            <Typography >
              {item.title}
            </Typography>
            </ListItemButton>
        ))}
      </List>
      </Drawer>
  )
}

export default Sidebar
