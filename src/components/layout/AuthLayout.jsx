import { Box, Container } from '@mui/system';
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import notionLogo from "../../assets/images/notion-logo.png";
import authUtils from '../../utils/authUtils';

function AuthLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    // JWTを持っているのか？
    const cheakAuth = async () => {
      // 認証チェック
      const isAuth = await authUtils.isAutenticated();
      if (isAuth) {
        navigate("/");
      }
    };
    cheakAuth();
  },[navigate])
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <Box  sx={{
          marginTop: 6,
          display: "flex",
          alignItems: "center",
          flexDirection: "column"
        }}>

          <img src={notionLogo} alt="ノーションロゴ"
           style={{width:100, height: 100, marginBottom: 3}}
          />
          Hitoiki日記
        </Box>
         <Outlet/>
      </Container>
    </div>
  )
}

export default AuthLayout
