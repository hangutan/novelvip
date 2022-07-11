import NotFound from '@layouts/NotFound';

const Error = (props) => <NotFound {...props} />;

Error.getInitialProps = ({ res, err }) => {
	const aaa = err ? err.statusCode : 404;
	const statusCode = res ? res.statusCode : aaa;
	return { statusCode };
};

export default Error;
