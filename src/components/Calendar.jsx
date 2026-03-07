import { useState, useMemo } from 'react';

export default function Calendar({ posts }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const postMap = useMemo(() => {
    const map = new Map();
    posts.forEach(p => {
      const d = new Date(p.data.date);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      map.set(dateStr, p);
    });
    return map;
  }, [posts]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const monthName = `${year}年${month + 1}月`;

  const days = [];
  for (let i = 0; i < startPadding; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const post = postMap.get(dateStr);
    days.push({
      date: dateStr,
      day: d,
      isToday,
      hasPost: !!post,
      postSlug: post?.slug
    });
  }

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button type="button" className="nav-btn" onClick={goToPrevMonth} aria-label="上个月">‹</button>
        <span className="month-title">{monthName}</span>
        <button type="button" className="nav-btn" onClick={goToNextMonth} aria-label="下个月">›</button>
      </div>
      <div className="calendar-weekdays">
        <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
      </div>
      <div className="calendar-days">
        {days.map((day, index) => (
          day ? (
            <a 
              key={day.date}
              href={day.postSlug ? `/posts/${day.postSlug}` : '#'}
              className={`calendar-day ${day.isToday ? 'today' : ''} ${day.hasPost ? 'has-post' : ''}`}
              onClick={e => !day.hasPost && e.preventDefault()}
            >
              {day.day}
            </a>
          ) : (
            <span key={`empty-${index}`} className="calendar-day empty"></span>
          )
        ))}
      </div>
      <div className="calendar-footer">
        <button type="button" className="today-btn" onClick={goToToday}>回到今天</button>
      </div>
    </div>
  );
}
