import React, { useState, useEffect } from 'react';
import { TextField, Stack, Autocomplete, Card, CardContent, Typography,CardActionArea } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useFetchData } from '../useFetchData'; 
import './Thing.css';
import './style.css';

const types = ['전체','클래식', '영화', '콘서트',  '무용', '뮤지컬/오페라', '연극', '국악', '전시/미술','축제-문화/예술','축제-기타','교육/체험', '기타'];

const Thing = () => {
  const [date, setDate] = useState('');
  const [region, setRegion] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [contentData, setContentData] = useState(null);
  const [regions, setRegions] = useState(null);
  const temp = useFetchData('content', '');
  
  useEffect(() => {
    if (temp) {
      setContentData(temp.data); 
      let regionList = temp.uniqueGUNAMEs;
      regionList.sort(); 
      regionList.unshift('전체'); 

      const indexOfOthers = regionList.indexOf('기타'); 
      if (indexOfOthers !== -1) {
        regionList.splice(indexOfOthers, 1); 
      }
      regionList.push('기타'); 

      setRegions(regionList); 
    }
  }, [temp]);

  if (!contentData || !regions) {
    return <div>Loading...</div>;
  }

  // 필터링
  const filteredContentData = contentData.filter(content => {
    const startDate = new Date(content.STARTDATE);
    const endDate = new Date(content.END_DATE);
    const selectedDate = new Date(date);

    return (
      (date ? (selectedDate >= startDate && selectedDate <= endDate) : true) &&
      (region !== '전체' ? content.GUNAME === region : true) &&
      (type !== '전체' ? content.CODENAME === type : true)
    );
  });

  // 페이지네이션
  const itemsPerPage = 5;
  const pageCount = Math.ceil(filteredContentData.length / itemsPerPage);
  const itemsOnPage = filteredContentData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <div style={{ backgroundColor: 'white', padding: '20px', minHeight: "80vh", display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Stack spacing={2} style={{ minWidth: '300px', marginBottom: '20px'}}>
          <TextField
            id="date"
            label="날짜"
            type="date"
            defaultValue={date}
            InputLabelProps={{
              shrink: true,
              className: 'custom-input-label',
            }}
            InputProps={{
              className: 'custom-input', // 커스텀 클래스를 추가합니다.
            }}
            onChange={(event) => setDate(event.target.value)}
          />
          <Autocomplete
            options={regions}
            renderInput={(params) => <TextField {...params} 
            label="지역"
            InputLabelProps={{
              shrink: true,
              className: 'custom-input-label',
            }}
            />}
            onChange={(event, newValue) => setRegion(newValue)}
          />
          <Autocomplete
            options={types}
            renderInput={(params) => <TextField {...params} label="유형"
            InputLabelProps={{
              shrink: true,
              className: 'custom-input-label',
            }} />}
            onChange={(event, newValue) => setType(newValue)}
          />
        </Stack>
        {filteredContentData.length > 0 ? (itemsOnPage.map((content, index) => (
          <Card className="content-card" variant="outlined">
            <CardActionArea component="a" href={content.HOMEPAGE} target="_blank">
              <CardContent>
                <img className="card-image" src={content.IMG} alt={content.TITLE} />
                <Typography gutterBottom className='custom-text1' variant="h5" component="div">
                  {content.TITLE}
                </Typography>
                <Typography className='custom-text2' variant="body2" color="text.secondary">
                  {content.GUNAME}
                </Typography>
                <Typography className='custom-text2' variant="body2" color="text.secondary">
                  {content.STARTDATE} - {content.END_DATE}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          ))
        ) : ( 
          <Typography className='custom-text2' variant="h5" color="text.secondary" >검색 결과가 없습니다.</Typography>
        )}
        <Pagination count={pageCount} page={page} onChange={(event, value) => setPage(value)} />
      </div>
    </div>
  );
};

export default Thing;