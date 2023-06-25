// Recommend.js
import React from 'react';
import { Button, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const congestionValues = {
  '여유': 12.5,
  '보통': 37.5,
  '약간 붐빔': 62.5,
  '붐빔': 87.5,
};

const Recommend = ({ placeData, handlePlaceClick, loading }) => {
  if (loading) {
    return (
      <Grid item xs={4}>
        <Button
          variant="text"
          style={{ color: "black", width: "100%" }}
          disabled={loading}
        >
          <CircularProgress size={20} />
        </Button>
      </Grid>
    );
  }

  const regions = [
    '강남구', '중구', '용산구',
    '송파구', '종로구', '마포구',
    '금천구', '광진구', '서초구',
    '구로구', '관악구', '은평구',
    '성동구', '도봉구', '동작구', 
    '강북구', '영등포구','과천시',
  ];

  // Calculate the least crowded place per region
  const leastCrowdedPlacePerRegion = regions.reduce((result, region) => {
    const placesInRegion = placeData.filter((place) => place.gu_name === region);
    if (placesInRegion.length > 0) {
      const leastCrowdedPlace = placesInRegion.reduce((a, b) => congestionValues[a.congest_lvl] < congestionValues[b.congest_lvl] ? a : b);
      result[region] = leastCrowdedPlace;
    }
    return result;
  }, {});

  // Sort places by congestion level (ascending) and pick the first 5
  const leastCrowdedPlaces = Object.values(leastCrowdedPlacePerRegion)
    .sort((a, b) => congestionValues[a.congest_lvl] - congestionValues[b.congest_lvl])
    .slice(0, 5);

  return (
    <Grid container justifyContent="center" alignItems="center" style={{backgroundColor: "rgba(100, 100, 100, 0.8)"}}>
    <div style={{color: "white", fontSize: "20px"}}>오늘의 추천 지역 : </div>
      {
        leastCrowdedPlaces.map((place, index) => (
          <Grid item xs={2} key={index}>
            <Button
              variant="text"
              style={{ color: "white",backgroundColor: "transparent", width: "100%" }}
              onClick={(event) => handlePlaceClick(place)}
              disabled={loading}
            >
              {`#${place.name}`}
            </Button>
          </Grid>
        ))
      }
    </Grid>
  );
};

export default Recommend;
