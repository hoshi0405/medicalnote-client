import { Box } from '@mui/system';
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import authUtils from '../../utils/authUtils';
import Sidebar from '../common/Sidebar';
import {useDispatch } from"react-redux"
import { setUser } from '../../redux/features/userSlice';


function AppLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // JWTを持っているのか？
    const cheakAuth = async () => {
      // 認証チェック
      const user = await authUtils.isAutenticated();
      if (!user) {
        navigate("/login");
      } else {
        // ユーザーがいた時
        dispatch(setUser(user));
      }
    };
    cheakAuth();
  },[navigate])
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Sidebar/>
        <Box sx={{flexGrow: 1,p: 1, width: "max-content"}}>
          <Outlet/>

        </Box>
      </Box>
    </div>
  )
}

export default AppLayout;
