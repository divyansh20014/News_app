import React,{ Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component{
 static defaultProps={
    country :'in',
    pageSize : 8,
    category :'general'
 }
 //document.title = `${capitalizeFirstLetter(props.category)}-NewsNinja`;
 static propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string,

 }
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
        articles: [],
        loading: true,
        page: 1,
        totalResults: 0,
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
}

  async updateNews() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=7d18e4c6e8b743888b57f6e8dd8eaf94&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading : true});
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(60);
    this.setState({
        articles : parsedData.articles,
        totalResults : parsedData.totalResults,
        loading:false,
    })
    this.props.setProgress(100);
  }
  async componentDidMount(){
    this.updateNews();
  }

 
  

  
   fetchMoreData = async () => {
    this.setState({page : this.state.page+1})
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=7d18e4c6e8b743888b57f6e8dd8eaf94&pageSize=${this.props.pageSize}&page=${this.state.page+1}`;
    this.setState({page : this.state.page+1})
    //setLoading(true);
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults,
    })
  };
  render(){

  
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{ margin: "35px 0px" , marginTop:"90px"}}>
          NewsNinja - Top {this.capitalizeFirstLetter(this.props.category)}{" "}
          Headlines
        </h1>
        { this.loading && <Spinner/>}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.totalResults}
          loader={<Spinner/>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        
        >
          <>
            <div className="row">
              {this.state.articles.map((element) => {
                return  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title : ""}
                      description={
                        element.description ? element.description : ""
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author ? element.author : "Anonymous"}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                
              })}
            </div>
          </>
        </InfiniteScroll>
      </div>
    );
  }
}



export default News;
