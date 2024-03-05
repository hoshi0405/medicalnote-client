import React , { useEffect }  from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import memoApi from '../api/memoApi';
import { useDispatch, useSelector } from "react-redux";
import { setMemo } from '../redux/features/memoSlice';


const Graph = () => {
  const dispatch = useDispatch();
  const memos = useSelector((state) => state.memo.value);

   useEffect(() => {
    const getMemos = async () => {
      try {
        const res = await memoApi.getAll();
        dispatch(setMemo(res));
      } catch (err) {
        alert(err);
      }
    };

    // ページがマウントされたときにのみデータを取得
    getMemos();
  }, [dispatch]);

  const ratings = memos.map((item) => item.rating || 0);
  const positions = memos.map((item) => item.position || 0);

  return (
    <>
        <LineChart
        xAxis={[{ data: positions }]}
        series={[
          {
            data: ratings,
          },
        ]}
        width={700}
        height={500}
        />
     </>
   );
}

export default Graph;
