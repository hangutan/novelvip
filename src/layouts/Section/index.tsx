import Header from './components/Header';
import HeadComp from './components/Head';
import Footer from './components/Footer';
import styles from './index.module.scss';

type Props = {
	children: JSX.Element[] | JSX.Element;
	translate: (str: string, obj?: { text: string }) => string;
	isHead?: boolean;
	isHeader?: boolean;
	isFooter?: boolean;
};

const Section = (props: Props) => {
	const { children, translate, isHead = true, isFooter = true, isHeader = true } = props;

	return (
		<>
			{isHead && <HeadComp translate={translate} />}
			<div className={styles.section}>
				{isHeader && <Header translate={translate} />}
				<div className={styles.section__body} id="section__body">
					{children}
				</div>
				{isFooter && <Footer translate={translate} />}
			</div>
		</>
	);
};

export default Section;
