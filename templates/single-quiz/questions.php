<?php
/**
 * Template for displaying the list of questions for the quiz
 *
 * @author  ThimPress
 * @package LearnPress
 * @version 1.0
 */

if ( !defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
global $quiz;
?>

<?php if( $quiz->has( 'questions' ) ): ?>

	<div class="quiz-questions" id="learn-press-quiz-questions">

		<?php do_action( 'learn_press_before_quiz_questions' ); ?>

		<ul class="quiz-questions-list">
			<?php if( $questions = $quiz->get_questions() ) foreach( $questions as $question ){?>
				<li data-id="<?php echo $question->ID;?>">
					<?php printf( '<a href="%s">%s</a>', $quiz->get_question_link( $question->ID ), get_the_title( $question->ID ) );?>
				</li>
			<?php }?>
		</ul>

		<?php do_action( 'learn_press_after_quiz_questions' ); ?>

	</div>

<?php else: ?>

	<?php learn_press_display_message( apply_filters( 'learn_press_quiz_no_questions_notice', __( 'This quiz hasn\'t got any questions', 'learn_press' ) ) ); ?>

<?php endif; ?>






