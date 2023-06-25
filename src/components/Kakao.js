import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Autocomplete, TextField, Stack  } from '@mui/material';
import { useFetchData } from '../useFetchData';
import './Kakao.css';
import PlaceModal from './Place';
import SpaceModal from './SpaceInfo';
import ContentModal from './Content';
import Recommend from './Recommend';
import './style.css'

const { kakao } = window;

const regions = [
  '강남구', '중구', '용산구',
  '송파구', '종로구', '마포구',
  '금천구', '광진구', '서초구',
  '구로구', '관악구', '은평구',
  '성동구', '도봉구', '동작구', 
  '강북구', '영등포구','과천시',
];

const types = ['혼잡도', '박물관·기념관·미술관', '전시·축제'];

const Kakao = () => {
  const data = useFetchData('place', '');
  const [map, setMap] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true); 

  // 카테고리 추가 
  const [region, setRegion] = useState(null);
  const [type, setType] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const [fetchDataType, setFetchDataType] = useState('');
  const [fetchDataRegion, setFetchDataRegion] = useState('');
  const placeData = useFetchData(fetchDataType, fetchDataRegion);

  useEffect(() => {
    if (data) setLoading(false); 
  }, [data]);

  useEffect(() => {
    if (!region || !type) {
      setCategoryData(["Loading..."]);
      setLoadingCategory(true);
      return;
    } 

    let fetchType;
    if (type === '혼잡도') {
      fetchType = 'place';
    } else if (type === '박물관·기념관·미술관') {
      fetchType = 'spaceInfo';
    } else if (type === '전시·축제') {
      fetchType = 'content';
    }
    setFetchDataType(fetchType);
    setFetchDataRegion(region);
  }, [region, type]);

  useEffect(() => {
    if (!placeData  || !type) return;

    if (type === '혼잡도') {
      setCategoryData(placeData.map(item => item.name));
    } else if (type === '박물관·기념관·미술관') {
      setCategoryData(placeData.map(item => item.FAC_NAME));
    }
    else if (type === '전시·축제') {
      setCategoryData(placeData.map(item => item.CODENAME));
    }
    setLoadingCategory(false);
  }, [placeData, type]);

  const handleRegionChange = (event, newValue) => {
    // 지역이 변경될 때마다 세부 카테고리 데이터와 선택된 값을 초기화
    setCategoryData([]);
    setSelectedCategory(null); // 선택된 카테고리를 초기화
    setRegion(newValue);
  };

  const handleTypeChange = (event, newValue) => {
    // 유형이 변경될 때마다 세부 카테고리 데이터와 선택된 값을 초기화
    setCategoryData([]);
    setSelectedCategory(null); // 선택된 카테고리를 초기화
    setType(newValue);
  };

  // 사용자가 세부 카테고리를 선택했을 때의 처리
  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    const place = placeData.find(p => p.name === newValue || p.FAC_NAME === newValue);
    if (place) {
      const position = new kakao.maps.LatLng(place.lat, place.lng);
      map.setCenter(position);
      map.setLevel(3);
      setSelectedPlace(place);  // 전체 장소 데이터를 설정
      setModalVisible(true);
    }
  };


  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.5511, 126.9909),
      level: 8,
    };

    const createdMap = new kakao.maps.Map(container, options);
    setMap(createdMap);
  }, []);

  useEffect(() => {
    if (!map || !placeData) return;

    placeData.forEach((place) => {
      const markerPosition = new kakao.maps.LatLng(place.lat, place.lng);

      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });

      marker.setMap(map);

      kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedPlace(place);
        setModalVisible(true);
      });
    });
  }, [map, placeData]);

  const handlePlaceClick = (placeName) => {
    if (placeData) {
      const place = placeData.find(p => p.name === placeName || p.FAC_NAME === placeName);
      if (place) {
        const position = new kakao.maps.LatLng(place.lat, place.lng);
        map.setCenter(position);
        map.setLevel(3);
        setSelectedPlace(place);
        setModalVisible(true);
      }
    }
    if (data) {
      const position = new kakao.maps.LatLng(placeName.lat, placeName.lng);
      map.setCenter(position);
      map.setLevel(3);
      setSelectedPlace(placeName);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlace(null);
  };

  return (
    <div style={{backgroundColor: "rgba(188, 188, 188, 0.5)", height: "100vh"}}>
      <Recommend placeData={data} handlePlaceClick={handlePlaceClick} loading={loading}/>
      <Grid style={{paddingTop: "5vh"}} container spacing={1}>
        <Grid item xs={8}>
          <div id="map" className="map" />
        </Grid>
        <Grid item xs={4} >
          <div className="side-panel">
            <Stack spacing={2}>
            <Autocomplete
              options={regions}
              renderInput={(params) => <TextField {...params} 
              label="지역"
              InputLabelProps={{
                shrink: true,
                className: 'custom-input-label',
              }}
              />}
              onChange={handleRegionChange}
            />
            <Autocomplete
              options={types}
              renderInput={(params) => <TextField {...params} label="유형"
              InputLabelProps={{
                shrink: true,
                className: 'custom-input-label',
              }} />}
              onChange={handleTypeChange}
            />
            <Autocomplete
              key={type}
              options={loadingCategory ? [] : categoryData}
              value={loadingCategory ? null : selectedCategory} // 로딩 상태일 때 선택된 카테고리를 비웁니다.
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField 
                  {...params}
                  label="세부 카테고리"
                  InputLabelProps={{
                    shrink: true,
                    className: 'custom-input-label',
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                    <React.Fragment>
                      {loadingCategory ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                    ),
                  }}
                />
              )}
              onChange={handleCategoryChange}
            />
          </Stack>
          </div>
        </Grid>
      </Grid>

      {modalVisible && type === '혼잡도' && <PlaceModal selectedPlace={selectedPlace} closeModal={closeModal} />}
      {modalVisible && type === '박물관·기념관·미술관' && <SpaceModal selectedPlace={selectedPlace} closeModal={closeModal} />}
      {modalVisible && type === '전시·축제' && <ContentModal selectedPlace={selectedPlace} closeModal={closeModal} />}
    </div>
  );
}

export default Kakao;
